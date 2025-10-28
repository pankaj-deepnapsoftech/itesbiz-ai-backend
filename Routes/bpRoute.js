const express = require("express");
const { addBP, updateBP, deleteBP, getBP } = require("../controllers/bpCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createUser } = require("../controllers/userController");
const router = express.Router();

router.post("/", authMiddleware, addBP,createUser);
router.put("/:bpId", authMiddleware, updateBP);
router.delete("/:id", authMiddleware, deleteBP);
router.get("/" , getBP);

module.exports = router;
