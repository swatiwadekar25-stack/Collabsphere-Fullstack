
import mongoose from "mongoose";
import Note from "../models/Note.js";
import Project from "../models/Project.js";

const validId = (id) => mongoose.isValidObjectId(id);

const createNote = async (req, res, next) => {
  try {
    const { title, content, projectId } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof projectId !== "string" ||
      !validId(projectId)
    ) {
      return res.status(400).json({
        message: "A note title and valid projectId are required.",
      });
    }

    if (content !== undefined && typeof content !== "string") {
      return res.status(400).json({
        message: "Note content must be text.",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content ?? "",
      project: project._id,
      owner: req.user._id,
    });

    res.status(201).json({ message: "Note created.", note });
  } catch (error) {
    next(error);
  }
};

const getNotes = async (req, res, next) => {
  try {
    const filter = { owner: req.user._id };

    if (req.query.projectId) {
      if (!validId(req.query.projectId)) {
        return res.status(400).json({ message: "Invalid project ID." });
      }

      filter.project = req.query.projectId;
    }

    const notes = await Note.find(filter).sort({ updatedAt: -1 });

    res.status(200).json({ notes });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID." });
    }

    const updates = {};

    for (const field of ["title", "content"]) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (
      Object.hasOwn(updates, "title") &&
      (typeof updates.title !== "string" || !updates.title.trim())
    ) {
      return res.status(400).json({ message: "Note title is required." });
    }

    if (
      Object.hasOwn(updates, "content") &&
      typeof updates.content !== "string"
    ) {
      return res.status(400).json({ message: "Note content must be text." });
    }

    if (updates.title) updates.title = updates.title.trim();

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json({ message: "Note updated.", note });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID." });
    }

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json({ message: "Note deleted." });
  } catch (error) {
    next(error);
  }
};

export { createNote, getNotes, updateNote, deleteNote };
