
import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createNote)
  .get(getNotes);

router.route("/:id")
  .patch(updateNote)
  .delete(deleteNote);

export default router;
