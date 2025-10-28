const mongoose = require("mongoose");

const cpSchema = new mongoose.Schema({
  corporateProgamId: {
    type: String,
    required: true,
    unique: true,
  },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  corporateName: {
    type: String,
    required: true,
  },
  corporateAddress: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfJoining: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  verified: {
    type: String,
    default: "No",
    enum: ["Yes", "No"],
  },
  photo: {
    type: String, // Store the URL or file path of the employee's photo
  },
  remarks: [{ val: { type: String }, time: { type: Date, default: Date.now } }],
  customerlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "customer" }],
  rpList: [{ type: mongoose.Schema.Types.ObjectId, ref: "rp" }],
});

const CP = mongoose.model("cp", cpSchema);

module.exports = CP;
