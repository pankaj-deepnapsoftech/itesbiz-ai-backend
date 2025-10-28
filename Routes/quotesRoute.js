const express = require("express");
const {
  QuoteUser,
  GetQuotes,
  SearchQuotes,
  UpdateQuotes,
  GetUpdateQuote,
  DeleteQuotes,
} = require("../controllers/quoteController");

const router = express.Router();


router.get("/", GetQuotes);
router.post("/", QuoteUser);
router.get("/searchquotes/:key", SearchQuotes);
router.get("/getupdatequotes/:id", GetUpdateQuote);
router.put("/updatequotes/:id", UpdateQuotes);
router.delete("/remove/:id", DeleteQuotes);

module.exports = router;
