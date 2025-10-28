const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z ]+$/.test(value);
      },
      message: "Name cannot contain numbers or special characters",
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return /^[0-9]{10}$/.test(value);
      },
      message:
        "Phone number must be exactly 10 digits and contain only numbers",
    },
  },
  designation: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  resume: {
    type: String,
    required: [true, "Please provide your CV"],
  },
});

const careerModel = mongoose.model("Career", careerSchema);
module.exports = careerModel;
