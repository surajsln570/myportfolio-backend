import slugify from "slugify";
import { Blog } from "../modals/blog.model.js";


// ✅ Create Blog
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, coverImage } = req.body;

    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const blog = await Blog.create({
      title,
      slug: slugify(title, { lower: true, strict: true }),
      excerpt,
      content,
      category,
      tags,
      coverImage,
      author: req.user?._id, // if using auth middleware
    });

    res.status(201).json({
      success: true,
      blog,
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error: error.message });
  }
};

// ✅ Get All Blogs (with pagination)
export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ isPublished: true });

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total,
      blogs,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
};

// ✅ Get Single Blog by Slug
export const getSingleBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findById(slug)
      .populate("author", "name email");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 🔥 Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error: error.message });
  }
};

// ✅ Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        ...req.body,
        slug: req.body.title ? slugify(req.body.title, { lower: true, strict: true }) : undefined,
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      success: true,
      blog: updatedBlog,
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error: error.message });
  }
};

// ✅ Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error: error.message });
  }
};

// ✅ Toggle Publish / Unpublish
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.status(200).json({
      success: true,
      isPublished: blog.isPublished,
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating publish status", error: error.message });
  }
};