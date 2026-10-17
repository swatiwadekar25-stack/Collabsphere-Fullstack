import crypto from "node:crypto";

import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import multer from "multer";
import File from "../models/File.js";
import Project from "../models/Project.js";

const uploadDirectory = path.resolve("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

const allowedExtensions = new Set([
  ".pdf", ".txt", ".md", ".png", ".jpg", ".jpeg",
  ".webp", ".js", ".jsx", ".ts", ".tsx", ".html",
  ".css", ".json", ".py", ".java", ".c", ".cpp",
]);

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.has(extension)) {
      return cb(new Error("This file type is not allowed."));
    }

    cb(null, true);
  },
});

const uploadSingleFile = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error) {
      const status = error instanceof multer.MulterError ? 400 : 415;

      return res.status(status).json({
        message: error.message || "File upload failed.",
      });
    }

    next();
  });
};

const createFile = async (req, res, next) => {
  let uploadedPath;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please attach a file using the field name 'file'.",
      });
    }

    uploadedPath = req.file.path;

    const { projectId } = req.body;

    if (
      typeof projectId !== "string" ||
      !mongoose.isValidObjectId(projectId)
    ) {
      await fs.unlink(uploadedPath).catch(() => {});
      return res.status(400).json({ message: "A valid projectId is required." });
    }

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id,
    });

    if (!project) {
      await fs.unlink(uploadedPath).catch(() => {});
      return res.status(404).json({ message: "Project not found." });
    }

    const file = await File.create({
      originalName: path.basename(req.file.originalname),
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      project: project._id,
      owner: req.user._id,
    });

    res.status(201).json({
      message: "File uploaded successfully.",
      file,
    });
  } catch (error) {
    if (uploadedPath) {
      await fs.unlink(uploadedPath).catch(() => {});
    }

    next(error);
  }
};

const getFiles = async (req, res, next) => {
  try {
    const filter = { owner: req.user._id };

    if (req.query.projectId) {
      if (!mongoose.isValidObjectId(req.query.projectId)) {
        return res.status(400).json({ message: "Invalid project ID." });
      }

      filter.project = req.query.projectId;
    }

    const files = await File.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ files });
  } catch (error) {
    next(error);
  }
};

const downloadFile = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid file ID." });
    }

    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    const filePath = path.resolve(uploadDirectory, file.storedName);

    if (path.dirname(filePath) !== uploadDirectory) {
      return res.status(400).json({ message: "Invalid file path." });
    }

    await fs.access(filePath);

    return res.download(filePath, file.originalName);
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({
        message: "The file is no longer available on the server.",
      });
    }

    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid file ID." });
    }

    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    const filePath = path.resolve(uploadDirectory, file.storedName);

    await fs.unlink(filePath).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });

    await file.deleteOne();

    res.status(200).json({ message: "File deleted." });
  } catch (error) {
    next(error);
  }
};

export {
  uploadSingleFile,
  createFile,
  getFiles,
  downloadFile,
  deleteFile,
};
