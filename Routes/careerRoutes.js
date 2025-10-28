const express = require("express");
const {
  CareerDetail,
  GetCareerDetail,
  DeleteCareer,
} = require("../controllers/careerController");
const upload = require("../middlewares/multer.js");

const router = express.Router();

router.get("/", GetCareerDetail);
router.post("/", upload.single("resume"), CareerDetail);
router.delete("/:id", DeleteCareer);

module.exports = router;
