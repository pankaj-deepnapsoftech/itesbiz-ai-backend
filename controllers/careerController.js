const asyncHandler = require("express-async-handler");
const careerModel = require("../Modals/careerModel");
const { mongooseError } = require("../middlewares/errorHandler");

const CareerDetail = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, designation } = req.body;
    const resume = req.file ? req.file.filename : null;

    console.log(req.body)
    console.log(resume);

    if (!name || !email || !phone || !designation || !resume) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await careerModel.create({ name, email, phone, designation, resume });
    res.status(200).json({ message: "Form Submitted Successfully!" });
  } catch (error) {
    console.error("Error in CareerDetail:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


const GetCareerDetail = asyncHandler(async (req, res) => {
  try {
    const getUsers = await careerModel.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});
const DeleteCareer = async (req, res) => {
  try {
    const data = req.params.id;
    let deletecareer = await careerModel.deleteOne({ _id: data });
    if (!deletecareer) {
      res.status(400).send({
        success: false,
        message: "User can't be deleted",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { CareerDetail, GetCareerDetail, DeleteCareer };
