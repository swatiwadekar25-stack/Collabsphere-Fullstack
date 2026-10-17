
import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createProject)
  .get(getProjects);

router.route("/:id")
  .get(getProjectById)
  .patch(updateProject)
  .delete(deleteProject);

export default router;
