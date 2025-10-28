const User = require("../Modals/userModal");
const Customer = require("../Modals/customerModal");
const CP = require("../Modals/cpmodel");
const RP = require("../Modals/rpModel");
const BP = require("../Modals/BusinessModel");
const xlsx = require("xlsx");
const { mongooseError } = require("../middlewares/errorHandler");
const asyncHandler = require("express-async-handler");

const addCustomer = asyncHandler(async (req, res) => {
  const { role, email } = req.user;
  try {
    let prgType, roleType;
    switch (role) {
      case "RP":
        prgType = await RP.findOne({ email }).populate("customerlist");
        roleType = "RP";
        break;
      case "CP":
        prgType = await CP.findOne({ email });
        roleType = "CP";
        break;
      case "BP":
        prgType = await BP.findOne({ email });
        roleType = "BP";
        break;
      default:
        return res.status(403).json({ message: "Operation is not allowed!" });
    }
    if (!prgType) {
      return res.status(404).json({ message: `${roleType} not found` });
    }

    const newCustomer = req.body;
    const isAvailable = prgType.customerlist.find(
      (customer) => customer.mobile == req.body.mobile
    );

    if (isAvailable) {
      return res.status(400).json({ message: "Customer already exists" });
    }
    const createdCustomer = await Customer.create(newCustomer);
    prgType.customerlist.push(createdCustomer._id);
    await prgType.save();
    res.status(201).json({ message: "Customer added", user: prgType });
  } catch (error) {
    mongooseError(error, res);
  }
});

const updateCustomer = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.params;
    const customer = req.body;
    const updatedCustomer = await Customer.findOneAndUpdate({ _id }, customer, {
      new: true,
    });
    if (!updatedCustomer) {
      return res.status(404).json({ error: "CP not found" });
    }
    res
      .status(200)
      .send({ message: "CP is Updated Sucessfull", updatedCustomer });
  } catch (error) {
    mongooseError(error, res);
  }
});

const bulkCustomerAdd = async (req, res) => {
  const excelFilePath = req?.file?.path;
  if (excelFilePath) {
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const sheet = workbook.Sheets[sheetName];
    const excelData = xlsx.utils.sheet_to_json(sheet);
    for (let i = 0; i < excelData.length; i++) {
      const { role, mobile, email } = req.user;
      switch (role) {
        case "RP": {
          try {
            const rp = await RP.findOne({ mobile });
            if (!rp) {
              return res.status(404).json({ message: "RP not found" });
            }
            const newCustomer = {
              mobile: excelData[i].Mobile,
              name: excelData[i].Name,
              email: excelData[i].Email,
              address: excelData[i].Address,
              city: excelData[i].City,
              state: excelData[i].State,
              interestedProduct: excelData[i].Product,
            };
            const isavailable = rp.customerlist.find(
              (customer) => customer.mobile == excelData[i].Mobile
            );

            if (isavailable) {
              return res
                .status(400)
                .json({ error: "Duplicate Customer already exist" });
            }
            rp.customerlist.push(newCustomer);
            await rp.save();
            if (i + 1 === excelData.length) {
              return res
                .status(200)
                .json({ error: "Customer added Successfull" });
            }
          } catch (error) {
            if (error.name === "ValidationError") {
              if (error.message.includes("mobile")) {
                return res
                  .status(400)
                  .json({ error: "Mobile number is required" });
              }
              const validationErrors = {};
              Object.keys(error.errors).forEach((key) => {
                validationErrors[key] = error.errors[key].message;
              });

              return res
                .status(400)
                .json({ error: "Validation error", details: validationErrors });
            }
            return res
              .status(500)
              .json({ message: "Operation is not Allowed !", error });
          }
          break;
        }
        case "CP": {
          try {
            const rp = await CP.findOne({ email });
            if (!rp) {
              return res.status(404).json({ message: "CP not found" });
            }
            const newCustomer = {
              mobile: excelData[i].Mobile,
              name: excelData[i].Name,
              email: excelData[i].Email,
              address: excelData[i].Address,
              city: excelData[i].City,
              state: excelData[i].State,
              interestedProduct: excelData[i].Product,
            };
            const isavailable = rp.customerlist.find(
              (customer) => customer.mobile == req.body.mobile
            );

            if (isavailable) {
              return res.status(400).json({ error: "Customer already exist" });
            }
            rp.customerlist.push(newCustomer);
            await rp.save();
            if (i + 1 === excelData.length) {
              return res
                .status(200)
                .json({ error: "Customer added Successfull" });
            }
          } catch (error) {
            if (error.name === "ValidationError") {
              if (error.message.includes("mobile")) {
                return res
                  .status(400)
                  .json({ error: "Mobile number is required" });
              }
              const validationErrors = {};
              Object.keys(error.errors).forEach((key) => {
                validationErrors[key] = error.errors[key].message;
              });

              return res
                .status(400)
                .json({ error: "Validation error", details: validationErrors });
            }
            return res
              .status(500)
              .json({ message: "Operation is not Allowed !", error });
          }
          break;
        }
        default:
          res.status(403).json({ message: "Operation is not Allowed !" });
          break;
      }
    }
  } else {
    res.status(400).json({ error: "No file selected" });
  }
};

module.exports = { addCustomer, updateCustomer, bulkCustomerAdd };
