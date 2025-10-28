const User = require("../Modals/userModal");
const BP = require("../Modals/BusinessModel");
const { mongooseError } = require("../middlewares/errorHandler");
const asyncHandler = require("express-async-handler");
const { sendEmail } = require("./emailCtrl");
const { prgJoinTemp } = require("../mailtemplate/programJoin");
const { generateRefferalToken } = require("../config/jwtToken");


const addBP = asyncHandler(async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const referalId = `${name.slice(0, 4).toUpperCase()}${mobile
      .toString()
      .slice(0, 4)}`;
    const newBp = await BP.create({ ...req.body, businessProgamId: referalId });
    const token = generateRefferalToken({
      name,
      email,
      id: newBp._id,
      type: "BP",
    });
    sendEmail({
      to: email,
      subject: "Business Program Mail confirmation",
      html: prgJoinTemp(
        "Business Program",
        name,
        token,
        req.user.name
      ),
    }).then(() => {
      res.send({
        message:
          "BP is added successfully, and a confirmation mail is sent to bp",
      });
    });
  } catch (err) {
    mongooseError(err, res);
  }
});

const updateBP = async (req, res) => {
  try {
    const { bpId } = req.params;
    const updatedBPData = req.body;
    const updatedBP = await BP.findOneAndUpdate({ _id: bpId }, updatedBPData, {
      new: true,
    });
    if (!updatedBP) {
      return res.status(404).json({ error: "BP not found" });
    }
    res.status(200).send({ message: "BP is Updated Sucessfull", updatedBP });
  } catch (error) {
    console.error("Error updating BP:", error);
    res.status(500).json({ error: "Failed to update BP" });
  }
};

const deleteBP = async (req, res) => {
  try {
    const BPId = req.params.id;
    const deletedBP = await BP.findByIdAndRemove(BPId);
    if (!deletedBP) {
      return res.status(404).json({ success: false, message: "BP not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "BP deleted successfully" });
  } catch (error) {
    console.error("Error deleting BP:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete BP" });
  }
};

const getBP = async (req, res) => {
  try {
     const getbp = await BP.find();
     res.json(getbp);
   } catch (error) {
     throw new Error(error);
   }
};

module.exports = { addBP, updateBP, deleteBP ,getBP};
