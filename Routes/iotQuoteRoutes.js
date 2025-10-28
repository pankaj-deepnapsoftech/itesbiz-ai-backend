const { deleteIotProduct } = require("../controllers/iotProductsController");
const {
  createIotQuote,
  getAllIotQuote,
  deleteIotQuote,
} = require("../controllers/iotQuoteController");
const express = require("express");

const router = express.Router();

router.get("/all", getAllIotQuote);
router.post("/iot/quote/products", createIotQuote);
router.delete("/:id", deleteIotQuote);

module.exports = router;
