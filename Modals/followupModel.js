const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema({
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
  empid: {
    type: String,
   
  },
  gender: {
    type: String,
    
  },
  status: {
    type: String,
    required: true,
  },
  remarks: [{ val: { type: String }, time: { type: Date, default: Date.now } }],
});

const RP = mongoose.model("followUp", followUpSchema);

module.exports = RP;
