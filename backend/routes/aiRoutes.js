
import express from "express";
import protect from "../middleware/authMiddleware.js";
import { askAI } from "../controllers/aiController.js";

const router = express.Router();

router.post("/ask", protect, askAI);

export default router;
