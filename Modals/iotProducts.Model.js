const mongoose = require("mongoose");

const iotProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  specification: {
    type: [String],
    required: true,
  },
  brandName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

 const IotProduct = mongoose.model("IotProduct", iotProductSchema);

module.exports = {IotProduct};
