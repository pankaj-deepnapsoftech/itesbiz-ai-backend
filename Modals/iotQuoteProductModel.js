const mongoose = require("mongoose");

const iotquoteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  productName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("IotQuote", iotquoteSchema);
