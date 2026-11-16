
import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI?.trim();
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from the backend environment.");
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 10000),
    ...(process.env.MONGO_DB_NAME ? { dbName: process.env.MONGO_DB_NAME } : {}),
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
};

export default connectDB;
