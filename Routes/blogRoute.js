const express = require("express");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getFeaturedBlogs,
} = require("../controllers/blogController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");

// Public routes (no authentication required)
router.get("/published", getPublishedBlogs); // Get published blogs for public
router.get("/featured", getFeaturedBlogs); // Get featured blogs
router.get("/:id", getBlogById); // Get single blog by ID or slug

// Protected routes (authentication required)
router.post("/", authMiddleware, upload.single("featuredImage"), createBlog); // Create new blog with image upload
router.get("/", authMiddleware, getAllBlogs); // Get all blogs (admin)
router.put("/:id", authMiddleware, upload.single("featuredImage"), updateBlog); // Update blog with optional image upload
router.delete("/:id", authMiddleware, deleteBlog); // Delete blog

module.exports = router;
