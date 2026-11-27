
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Load the backend's local environment file even when `node backend/server.js`
// is started from the repository root. In hosted environments, platform env
// vars continue to take precedence.
dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

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

const localOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];
const allowedOrigins = new Set([
  ...localOrigins,
  ...(process.env.CLIENT_URL || "").split(",").map((origin) => origin.trim()).filter(Boolean),
]);

// 1. Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS."));
    },
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// 2. Health check (does not require a database connection)
app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: databaseConnected ? "OK" : "degraded",
    server: "running",
    database: {
      status: databaseConnected ? "connected" : "disconnected",
      name: mongoose.connection.name || null,
    },
  });
});

app.get("/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: databaseConnected ? "OK" : "degraded",
    server: "running",
    database: {
      status: databaseConnected ? "connected" : "disconnected",
      name: mongoose.connection.name || null,
    },
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

// Local development starts accepting requests only after MongoDB is ready.
// Vercel invokes the exported app and connects lazily in the middleware above.
async function startServer() {
  await connectDB();

  const port = Number(process.env.PORT || 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid TCP port number.");
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`CollabSphere backend listening on port ${port}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((error) => {
    console.error(`Backend startup failed: ${error.message}`);
    process.exitCode = 1;
  });
}
// 7. Export the Express app for Vercel
export default app;
