const mongoose = require("mongoose");

const rpSchema = new mongoose.Schema({
  refferalProgamId: {
    type: String,
    required: true,
    unique: true,
  },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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

const RP = mongoose.model("rp", rpSchema);

module.exports = RP;
