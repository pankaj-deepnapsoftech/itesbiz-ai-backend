const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    featuredImage: {
      type: String, // URL to the featured image
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure slug exists before validation (required field)
blogSchema.pre("validate", function (next) {
  if (this.isModified("title") || !this.slug) {
    if (this.title) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .trim();
    }
  }
  next();
});

// Set publishedAt when status changes to published
blogSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
  next();
});

// Keep slug updated when title changes via findOneAndUpdate
blogSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};
  const title = update.title || (update.$set && update.$set.title);
  if (title) {
    const newSlug = String(title)
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();
    if (update.$set) {
      update.$set.slug = newSlug;
    } else {
      update.slug = newSlug;
    }
    this.setUpdate(update);
  }

  // Set publishedAt when status becomes published in updates
  const status = update.status || (update.$set && update.$set.status);
  if (status === "published") {
    if (update.$set) {
      if (!update.$set.publishedAt) update.$set.publishedAt = new Date();
    } else if (!update.publishedAt) {
      update.publishedAt = new Date();
    }
    this.setUpdate(update);
  }

  next();
});

module.exports = mongoose.model("Blog", blogSchema);
