const User = require("../Modals/userModal");
const FollowUP = require("../Modals/followupModel");

const addFollowUP = async (req, res, next) => {
  try {
    const data = req.body;
    const FollowUPData = data;
    const newFollowUP = new FollowUP(FollowUPData);
    await newFollowUP.save();
    res
      .status(200)
      .send({ message: "FollowUP is Added Successfully", newFollowUP });
  } catch (err) {
    if (err.code === 11000) {
      if (err.message.includes("mobile")) {
        res.status(400).json({ error: "Mobile number already exists" });
      } else if (err.message.includes("email")) {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(400).json({ error: "Duplicate data found" });
      }
    } else {
      console.error("Error adding FollowUP:", err);
      res.status(500).json({ error: "Failed to add FollowUP" });
    }
  }
};

const updateFollowUP = async (req, res) => {
  try {
    const { _id } = req.params;
    const updatedFollowUPData = req.body;

    const updatedFollowUP = await FollowUP.findOneAndUpdate(
      { _id },
      updatedFollowUPData,
      { new: true }
    );
    if (!updatedFollowUP) {
      return res.status(404).json({ error: "FollowUP not found" });
    }
    res
      .status(200)
      .send({ message: "FollowUP is Updated Sucessfull", updatedFollowUP });
  } catch (error) {
    console.error("Error updating FollowUP:", error);
    res.status(500).json({ error: "Failed to update FollowUP" });
  }
};
const deleteFollowUP = async (req, res) => {
  try {
    const FollowUPId = req.params.id;
    const deletedFollowUP = await FollowUP.findByIdAndRemove(FollowUPId);
    if (!deletedFollowUP) {
      return res
        .status(404)
        .json({ success: false, message: "FollowUP not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "FollowUP deleted successfully" });
  } catch (error) {
    console.error("Error deleting FollowUP:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete FollowUP" });
  }
};

const GetFollowUp = async (req, res) => {
  try {
    const getUsers = await FollowUP.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
}
module.exports = { addFollowUP, updateFollowUP, deleteFollowUP,GetFollowUp };
