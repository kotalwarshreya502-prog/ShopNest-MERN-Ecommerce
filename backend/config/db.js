const mongoose = require("mongoose");

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || process.env.MONGO_URL;
  const localFallbackUri = "mongodb://127.0.0.1:27017/shopnest";

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`\n❌ [DATABASE CONNECTION ERROR]: ${error.message}`);
      console.error("👉 Tip: In MongoDB Atlas, verify that Network Access has IP 0.0.0.0/0 enabled (required for Render cloud instances).");
      if (process.env.NODE_ENV === "production") {
        process.exit(1);
      }
      console.warn("Attempting local MongoDB fallback for development...");
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("\n❌ [DEPLOYMENT ERROR] MONGO_URI environment variable is missing!");
    console.error("👉 Go to Render Dashboard -> shopnest-backend -> Environment tab -> Add MONGO_URI with your MongoDB Atlas connection string.\n");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(localFallbackUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`Connected to local MongoDB fallback: ${conn.connection.host}/shopnest`);
  } catch (localError) {
    console.error("MongoDB connection failed for both primary and local instances:", localError.message);
    process.exit(1);
  }
};

module.exports = connectDB;
