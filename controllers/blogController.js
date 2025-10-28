const blogModel = require("../Modals/blogModel");
const asyncHandle = require("express-async-handler");

// Create a new blog post
const createBlog = asyncHandle(async (req, res) => {
  try {
    const {
      title,
      content,
      author,
      excerpt,
      tags,
      category,
      status,
      isFeatured,
    } = req.body;

    // Validation
    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and author are required",
      });
    }

    // Normalize tags and isFeatured from multipart or JSON bodies
    let normalizedTags = [];
    if (Array.isArray(tags)) {
      normalizedTags = tags;
    } else if (typeof tags === "string") {
      try {
        const parsed = JSON.parse(tags);
        normalizedTags = Array.isArray(parsed)
          ? parsed
          : tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
      } catch (e) {
        normalizedTags = tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    const normalizedIsFeatured =
      typeof isFeatured === "string"
        ? isFeatured === "true" || isFeatured === "1"
        : Boolean(isFeatured);

    const blog = new blogModel({
      title,
      content,
      author,
      excerpt,
      featuredImage: req.file ? `/images/${req.file.filename}` : "",
      tags: normalizedTags,
      category: category || "General",
      status: status || "draft",
      isFeatured: normalizedIsFeatured || false,
    });

    const savedBlog = await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: savedBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: error.message,
    });
  }
});

// Get all blog posts (for admin)
const getAllBlogs = asyncHandle(async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await blogModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await blogModel.countDocuments(query);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
});

// Get published blog posts (for public)
const getPublishedBlogs = asyncHandle(async (req, res) => {
  try {
    const { page = 1, limit = 6, category, search } = req.query;
    const skip = (page - 1) * limit;

    let query = { status: "published" };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await blogModel
      .find(query)
      .select(
        "title excerpt author slug featuredImage category publishedAt views isFeatured"
      )
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await blogModel.countDocuments(query);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
      },
    });
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching published blogs",
      error: error.message,
    });
  }
});

// Get a single blog post by ID or slug
const getBlogById = asyncHandle(async (req, res) => {
  try {
    const { id } = req.params;

    let blog;

    // Check if it's a MongoDB ObjectId or a slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await blogModel.findById(id);
    } else {
      blog = await blogModel.findOne({ slug: id });
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Increment view count if it's a published blog
    if (blog.status === "published") {
      blog.views += 1;
      await blog.save();
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message,
    });
  }
});

// Update a blog post
const updateBlog = asyncHandle(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Normalize tags if provided in multipart
    if (typeof updateData.tags === "string") {
      try {
        const parsed = JSON.parse(updateData.tags);
        updateData.tags = Array.isArray(parsed)
          ? parsed
          : updateData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
      } catch (e) {
        updateData.tags = updateData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    if (typeof updateData.isFeatured === "string") {
      updateData.isFeatured =
        updateData.isFeatured === "true" || updateData.isFeatured === "1";
    }

    // If a new image file is uploaded, set featuredImage to the served path
    if (req.file && req.file.filename) {
      updateData.featuredImage = `/images/${req.file.filename}`;
    }

    const blog = await blogModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
});

// Delete a blog post
const deleteBlog = asyncHandle(async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blogModel.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
});

// Get featured blogs
const getFeaturedBlogs = asyncHandle(async (req, res) => {
  try {
    const blogs = await blogModel
      .find({ status: "published", isFeatured: true })
      .select(
        "title excerpt author slug featuredImage category publishedAt views"
      )
      .sort({ publishedAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured blogs",
      error: error.message,
    });
  }
});

module.exports = {
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getFeaturedBlogs,
};
