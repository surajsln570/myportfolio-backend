import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    excerpt: {
      type: String,
      required: true,
      maxlength: 300,
    },

    content: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String, // image URL
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    category: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    readingTime: {
      type: String,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// 🔥 Auto generate slug before saving
blogSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const Blog = mongoose.model("Blog", blogSchema);