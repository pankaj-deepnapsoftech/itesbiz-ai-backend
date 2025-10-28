const multer = require("multer");
const path = require("path");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Folder where images should be saved
  },
  filename: (req, file, cb) => {
    
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

module.exports = upload; // ✅ Export `upload` directly
