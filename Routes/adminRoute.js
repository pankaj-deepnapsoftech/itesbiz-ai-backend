const express = require("express");
const { getAdminData, verifyRefferal } = require("../controllers/adminCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getAdminData);
router.post("/:token", verifyRefferal);

module.exports = router;
