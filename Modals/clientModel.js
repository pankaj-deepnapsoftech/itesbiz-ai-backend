const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    website: {
      type: String,
    },
    projectName: {
      type: String,
      required: true,
    },
    projectDescription: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },

    remarks: [
      { val: { type: String }, time: { type: Date, default: Date.now } },
    ],
    clientOf: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("client", clientSchema);
