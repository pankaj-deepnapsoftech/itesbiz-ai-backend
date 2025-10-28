const mongoose = require("mongoose");

const businesspSchema = new mongoose.Schema({
  businessProgamId: {
    type: String,
    required: true,
    unique: true,
  },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  businessName: {
    type: String,
    required: true,
  },
  businessAddress: {
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
    type: String,
  },
  remarks: [{ val: { type: String }, time: { type: Date, default: Date.now } }],
  customerlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "customer" }],
});

module.exports = mongoose.model("businessp", businesspSchema);
