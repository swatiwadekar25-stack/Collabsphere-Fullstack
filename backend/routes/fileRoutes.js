
import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  uploadSingleFile,
  createFile,
  getFiles,
  downloadFile,
  deleteFile,
} from "../controllers/fileController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(uploadSingleFile, createFile)
  .get(getFiles);

router.get("/:id/download", downloadFile);
router.delete("/:id", deleteFile);

export default router;
