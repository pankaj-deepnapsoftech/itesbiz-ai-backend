const User = require("../Modals/userModal");
const Employee = require("../Modals/empModel");
const asyncHandler = require("express-async-handler");
const { mongooseError } = require("../middlewares/errorHandler");

const addEmployee = asyncHandler(async (req, res, next) => {
  try {
    const employeeData = req.body;
    const { name, email, mobile } = req.body;
    const newEmployee = new Employee(employeeData);
    await newEmployee.save();
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.body = {
        name,
        email,
        mobile,
        password: "#Deepnap123",
        role: "employee",
      };
      next();
    } else {
      res
        .status(201)
        .send({ message: "Employee is Added Successfully", newEmployee });
    }
  } catch (err) {
    mongooseError(err, res);
  }
});

const updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updatedEmployeeData = req.body;
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeId },
      updatedEmployeeData,
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res
      .status(200)
      .send({ message: "Employee is Updated Sucessfull", updatedEmployee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Failed to update employee" });
  }
};
const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const deletedEmployee = await Employee.findByIdAndRemove(employeeId);
    if (!deletedEmployee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete employee" });
  }
};

const GetEmployee = async (req, res) => {
  try {
    const getEmployee = await Employee.find();
    res.json(getEmployee);
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = { addEmployee, updateEmployee, deleteEmployee ,GetEmployee};
