
import mongoose from "mongoose";
import Project from "../models/Project.js";

const validId = (id) => mongoose.isValidObjectId(id);

const createProject = async (req, res, next) => {
  try {
    const { title, description, technologies, status, githubUrl, liveUrl } =
      req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Project title is required." });
    }

    if (technologies !== undefined && !Array.isArray(technologies)) {
      return res.status(400).json({
        message: "Technologies must be an array of strings.",
      });
    }

    if (
      technologies?.some(
        (technology) => typeof technology !== "string"
      )
    ) {
      return res.status(400).json({
        message: "Each technology must be a string.",
      });
    }

    const project = await Project.create({
      title: title.trim(),
      description,
      technologies: technologies?.map((item) => item.trim()),
      status,
      githubUrl,
      liveUrl,
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID." });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID." });
    }

    const allowedFields = [
      "title",
      "description",
      "technologies",
      "status",
      "githubUrl",
      "liveUrl",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (
      Object.hasOwn(updates, "title") &&
      (typeof updates.title !== "string" || !updates.title.trim())
    ) {
      return res.status(400).json({ message: "Project title is required." });
    }

    if (
      Object.hasOwn(updates, "technologies") &&
      (!Array.isArray(updates.technologies) ||
        updates.technologies.some((item) => typeof item !== "string"))
    ) {
      return res.status(400).json({
        message: "Technologies must be an array of strings.",
      });
    }

    if (updates.title) updates.title = updates.title.trim();

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json({
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID." });
    }

    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Remove associated database records too.
    const Note = (await import("../models/Note.js")).default;
    const File = (await import("../models/File.js")).default;

    await Promise.all([
      Note.deleteMany({ project: project._id, owner: req.user._id }),
      File.deleteMany({ project: project._id, owner: req.user._id }),
    ]);

    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
