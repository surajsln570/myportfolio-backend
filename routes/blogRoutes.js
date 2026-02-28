import express from "express";
import { createBlog, deleteBlog, getAllBlogs, getSingleBlog, togglePublish, updateBlog } from "../controler/blogController.js";

export const blogRouter = express.Router();

blogRouter.post("/", createBlog);
blogRouter.get("/", getAllBlogs);
blogRouter.get("/:slug", getSingleBlog);
blogRouter.put("/:id", updateBlog);
blogRouter.delete("/:id", deleteBlog);
blogRouter.patch("/toggle/:id", togglePublish);
