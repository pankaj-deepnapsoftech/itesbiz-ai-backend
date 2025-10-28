const User = require("../Modals/userModal");
const clientModel = require("../Modals/clientModel");
const { mongooseError } = require("../middlewares/errorHandler");
const asyncHandler = require("express-async-handler");

const addRp = asyncHandler(async (req, res) => {
  try {
    const newClient = new clientModel(req.body)
    await newClient.save();
    res.status(201).send({message:"Clent Created Sucessfully",newClient})
  } catch (err) {
    mongooseError(err, res);
  }
});

const updateRP = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(rpId);
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

module.exports = { addRp, updateRP, deleteRP };
