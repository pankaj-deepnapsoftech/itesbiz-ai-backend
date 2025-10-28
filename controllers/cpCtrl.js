const User = require("../Modals/userModal");
const CP = require("../Modals/cpmodel");
const { sendEmail } = require("./emailCtrl");
const { prgJoinTemp } = require("../mailtemplate/programJoin");
const { mongooseError } = require("../middlewares/errorHandler");
const asyncHandler = require("express-async-handler");
const { generateRefferalToken } = require("../config/jwtToken");

const addCP = asyncHandler(async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const referalId = `${name.slice(0, 4).toUpperCase()}${mobile
      .toString()
      .slice(0, 4)}`;
    const newCp = await CP.create({ ...req.body, corporateProgamId: referalId });
      const token = generateRefferalToken({
        name,
        email,
        id: newCp._id,
        type: "CP",
      });
    sendEmail({
      to: email,
      subject: "Corporate Program Mail confirmation",
      html: prgJoinTemp(
        "Corporate Program",
        name,
        token
      ),
    }).then(() => {
      res.send(
        "Cp is added successfully, and a confirmation mail is sent to Cp"
      );
    });
  } catch (err) {
    mongooseError(err, res);
  }
});

const updateCP = async (req, res) => {
  try {
    const { CPId } = req.params;
    const updatedCPData = req.body;
    const updatedCP = await CP.findOneAndUpdate({ _id: CPId }, updatedCPData, {
      new: true,
    });
    if (!updatedCP) {
      return res.status(404).json({ error: "CP not found" });
    }
    res.status(200).send({ message: "CP is Updated Sucessfull", updatedCP });
  } catch (error) {
    console.error("Error updating CP:", error);
    res.status(500).json({ error: "Failed to update CP" });
  }
};
const deleteCP = async (req, res) => {
  try {
    const CPId = req.params.id;
    const deletedCP = await CP.findByIdAndRemove(CPId);
    if (!deletedCP) {
      return res.status(404).json({ success: false, message: "CP not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "CP deleted successfully" });
  } catch (error) {
    console.error("Error deleting CP:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete CP" });
  }
};

const getCP = async (req, res) => {
  try {
     const getcp = await CP.find();
     res.json(getcp);
   } catch (error) {
     throw new Error(error);
   }
};

module.exports = { addCP, updateCP, deleteCP ,getCP};
