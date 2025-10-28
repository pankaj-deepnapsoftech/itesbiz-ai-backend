const express = require("express");
const multer = require("multer");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  addCustomer,
  updateCustomer,
  bulkCustomerAdd,
} = require("../controllers/customerCtrl");
const router = express.Router();
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.post("/", authMiddleware, addCustomer);
router.put("/:_id", authMiddleware, updateCustomer);
router.post(
  "/excel",
  authMiddleware,
  upload.single("excelFile"),
  bulkCustomerAdd
);

module.exports = router;
