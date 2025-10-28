const User = require("../Modals/userModal");
const RP = require("../Modals/rpModel");
const { sendEmail } = require("./emailCtrl");
const { prgJoinTemp } = require("../mailtemplate/programJoin");
const { mongooseError } = require("../middlewares/errorHandler");
const asyncHandler = require("express-async-handler");
const { generateRefferalToken } = require("../config/jwtToken");


const addRp = asyncHandler(async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const referalId = `${name.slice(0, 4).toUpperCase()}${mobile
      .toString()
      .slice(0, 4)}`;
    const newRp = await RP.create({ ...req.body, refferalProgamId: referalId });
    const token = generateRefferalToken({
      name,
      email,
      id: newRp._id,
      type: "RP",
    });
    sendEmail({
      to: email,  
      subject: "Refferal Program Mail confirmation",
      html: prgJoinTemp("Refferal Program", name,token,req.user.name),
    }).then(() => {
       res.send({
         message:
           "RP is added successfully, and a confirmation mail is sent to rp",
       });
    });
  } catch (err) {
    mongooseError(err, res);
  }
});

const updateRP = async (req, res) => {
  try {
    const { rpId } = req.params;
    const updatedRPData = req.body;

    const updatedRP = await RP.findOneAndUpdate(
      { refferalProgamId: rpId },
      updatedRPData,
      { new: true }
    );
    if (!updatedRP) {
      return res.status(404).json({ error: "RP not found" });
    }
    res.status(200).send({ message: "RP is Updated Sucessfull", updatedRP });
  } catch (error) {
    console.error("Error updating RP:", error);
    res.status(500).json({ error: "Failed to update RP" });
  }
};
const deleteRP = async (req, res) => {
  try {
    const RPId = req.params.id;
    const deletedRP = await RP.findByIdAndRemove(RPId);
    if (!deletedRP) {
      return res.status(404).json({ success: false, message: "RP not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "RP deleted successfully" });
  } catch (error) {
    console.error("Error deleting RP:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete RP" });
  }
};

const getRP = async (req, res) => {
  try {
     const getrp = await RP.find();
     res.json(getrp);
   } catch (error) {
     throw new Error(error);
   }
};

module.exports = { addRp, updateRP, deleteRP,getRP };
