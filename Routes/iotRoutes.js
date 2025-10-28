const express = require("express");
const { createIotProduct, getAllIotProducts, updateIotProduct, deleteIotProduct } = require("../controllers/iotProductsController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");

const router = express.Router();

router.post("/", upload.single("image"),authMiddleware,  createIotProduct);
router.get("/all",  getAllIotProducts);
router.put("/:IotProductId", authMiddleware,upload.single("image"),updateIotProduct);
router.delete("/:id", authMiddleware, deleteIotProduct);


module.exports = router;
