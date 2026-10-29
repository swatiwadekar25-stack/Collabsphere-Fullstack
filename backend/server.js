
import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

const app = express();

// 1. Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// 2. Health check (does not require a database connection)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "CollabSphere backend is running.",
  });
});

// 3. Connect to MongoDB before handling API routes.
// Cache the connection promise across warm serverless invocations.
let dbPromise;

app.use(async (req, res, next) => {
  try {
    if (!dbPromise) {
      dbPromise = connectDB();
    }

    await dbPromise;
    next();
  } catch (error) {
    dbPromise = null;
    console.error("MongoDB connection failed:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection failed.",
    });
  }
});

// 4. API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/ai", aiRoutes);

// 5. Error handlers
app.use(notFound);
app.use(errorHandler);

// 6. Local development only.
// Vercel handles incoming requests in production.
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CollabSphere backend running on port ${PORT}`);
  });
}

// 7. Export the Express app for Vercel
export default app;
