const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { addFollowUP, updateFollowUP, deleteFollowUP, GetFollowUp } = require("../controllers/followupCtrl");
const router = express.Router();

router.post("/", authMiddleware, addFollowUP,);
router.put("/:_id", authMiddleware, updateFollowUP);
router.delete("/:id", authMiddleware, deleteFollowUP);
router.get("/" , GetFollowUp);

module.exports = router;
