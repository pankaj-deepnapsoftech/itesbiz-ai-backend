const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String, // Changed to String for phone numbers
      unique: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    interestedProduct: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    verified: {
      type: String,
      default: "No",
      enum: ["Yes", "No"],
    },
    remarks: [
      { val: { type: String }, time: { type: Date, default: Date.now } },
    ],
    customerOf: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("customer", customerSchema);
