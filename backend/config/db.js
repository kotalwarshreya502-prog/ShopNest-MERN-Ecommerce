const mongoose = require("mongoose");

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || process.env.MONGO_URL;
  const localFallbackUri = "mongodb://127.0.0.1:27017/shopnest";

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(`Primary MongoDB connection failed (${error.message}). Attempting local fallback...`);
    }
  }

  try {
    const conn = await mongoose.connect(localFallbackUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`Connected to local MongoDB fallback: ${conn.connection.host}/shopnest`);
  } catch (localError) {
    console.error("MongoDB connection failed for both primary and local instances:", localError.message);
    console.error("Tip: If using MongoDB Atlas, ensure your current IP address is added to Atlas Network Access (0.0.0.0/0 for development).");
    process.exit(1);
  }
};

module.exports = connectDB;
