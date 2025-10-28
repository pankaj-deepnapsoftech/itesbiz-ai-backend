const asyncHandle = require("express-async-handler");
const CareerModel = require("../Modals/careerModel");
const ContactModel = require("../Modals/contactModel");
const QuoteModel = require("../Modals/quoteModel");
const EmployeeModel = require("../Modals/empModel");
const RpModel = require("../Modals/rpModel");
const BpModel = require("../Modals/BusinessModel");
const CpModel = require("../Modals/cpmodel");
const FollowUPModel = require("../Modals/followupModel");
const User = require("../Modals/userModal");
const { checkMongoId } = require("../utils/checkIds");
const { decryptToken } = require("../config/jwtToken");
const { mongooseError } = require("../middlewares/errorHandler");
const { sendEmail } = require("./emailCtrl");
const {
  verifyProgarm,
  verifyAlreadyProgarm,
} = require("../mailtemplate/programJoin");
const { IotProduct } = require("../Modals/iotProducts.Model");

const populateAddedBy = async (Model) => {
  return await Model.find().populate([
    {
      path: "addedBy",
      select: "name",
    },
    {
      path: "customerlist",
    },
  ]);
};

const getAdminData = asyncHandle(async (req, res) => {
  const users = await User.find();
  const contacts = await ContactModel.find();
  const enquiry = await QuoteModel.find();
  const carrier = await CareerModel.find();
  const employees = await EmployeeModel.find();
  const iotproducts = await IotProduct.find();
  const rp = await populateAddedBy(RpModel);
  const bp = await populateAddedBy(BpModel);
  const cp = await populateAddedBy(CpModel);
  const followup = await FollowUPModel.find().populate({
    path: "addedBy",
    select: "name",
  });
  const { role, _id, email } = req.user;
  switch (role) {
    case "admin":
      res.json({
        users,
        contacts,
        enquiry,
        carrier,
        employees,
        iotproducts,
        rp,
        bp,
        cp,
        followup,
      });
      break;
    case "employee":
      res.json({
        rp: rp.filter((r) => checkMongoId(r?.addedBy?._id, _id)),
        bp: bp.filter((r) => checkMongoId(r?.addedBy?._id, _id)),
        cp: cp.filter((r) => checkMongoId(r?.addedBy?._id, _id)),
        followup: followup.filter((r) => checkMongoId(r?.addedBy?._id, _id)),
      });
      break;
    case "RP":
      const rpdata = await RpModel.findOne({ email }).populate("customerlist");
      if (!rpdata) {
        return res.status(404).json({ message: "RP user not found" });
      }
      res.status(201).json({ customer: rpdata.customerlist });
      break;
    case "CP":
      const cpdata = await CpModel.findOne({ email }).populate([
        "customerlist",
        "rpList",
      ]);
      if (!cpdata) {
        return res.status(404).json({ message: "RP user not found" });
      }
      res.status(201).json({
        customer: cpdata.customerlist,
        rp: rp.filter((r) => checkMongoId(r?.addedBy?._id, _id)),
      });
      break;
    case "BP":
      const bpdata = await BpModel.findOne({ email }).populate("customerlist");
      if (!bpdata) {
        return res.status(404).json({ message: "BP user not found" });
      }
      res.status(201).json({ customer: bpdata.customerlist });
      break;
  }
});

const verifyRefferal = asyncHandle(async (req, res, next) => {
  try {
    const { token } = req.params;
    const details = decryptToken(token);

    if (!details.id) {
      throw new Error(
        "Link is Expired ! Contact our agent to sent the link again"
      );
    }

    const { id, type } = details;
    let Model;

    switch (type) {
      case "BP":
        Model = BpModel;
        break;
      case "CP":
        Model = CpModel;
        break;
      case "RP":
        Model = RpModel;
        break;
      default:
        throw new Error("Invalid type");
    }

    if (Model) {
      const updatedDoc = await Model.findByIdAndUpdate(
        id,
        { verified: "Yes" },
        { new: true }
      );
      if (!updatedDoc) {
        throw new Error("The Requested details is not found");
      }

      const { name, email, mobile } = updatedDoc;
      const user = await User.findOne({ email });
      if (user) {
        sendEmail({
          to: email,
          html: verifyAlreadyProgarm(name, email),
          subject: "Password For Accessing The Deepnap Softech Dashboard",
        });
        // await User.findOneAndUpdate({ email }, { $set: { role: type } });
        // return res.send("Mail has sent Successfully, and user role updated.");
        return res.send("Mail has sent Sucessfully");
      }

      const password = `${name.slice(0, 4).toUpperCase()}@${mobile
        .toString()
        .slice(0, 4)}`;

      const newUser = await User.create({
        name,
        email,
        mobile,
        password,
        role: type,
      });

      sendEmail({
        to: email,
        html: verifyProgarm(name, password),
        subject: "Password For Accessing The Deepnap Softech Dashboard",
      });

      res.send(newUser);
    }
  } catch (error) {
    // Handle errors
    mongooseError(error, res);
  }
});

module.exports = { getAdminData, verifyRefferal };
