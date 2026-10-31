const mongoose = require("mongoose");

// Normalizes MongoDB connection URI to strictly target the 'shopnest' database
const normalizeMongoUri = (rawUri) => {
  if (!rawUri) return rawUri;
  let uri = rawUri.trim();
  try {
    const qIndex = uri.indexOf("?");
    const base = qIndex !== -1 ? uri.substring(0, qIndex) : uri;
    const query = qIndex !== -1 ? uri.substring(qIndex) : "";
    const protocolEnd = base.indexOf("://");

    if (protocolEnd !== -1) {
      const pathPart = base.substring(protocolEnd + 3);
      const firstSlashInPath = pathPart.indexOf("/");
      if (firstSlashInPath === -1) {
        // e.g. mongodb+srv://cluster.net -> mongodb+srv://cluster.net/shopnest
        return base + "/shopnest" + query;
      } else {
        const dbName = pathPart.substring(firstSlashInPath + 1);
        if (!dbName || dbName.toLowerCase() === "test") {
          const root = base.substring(0, protocolEnd + 3 + firstSlashInPath);
          return root + "/shopnest" + query;
        }
      }
    }
  } catch (err) {
    console.warn("URI normalization fallback:", err.message);
  }
  return uri;
};

const connectDB = async () => {
  const rawUri = process.env.MONGO_URI || process.env.MONGO_URL;
  const primaryUri = normalizeMongoUri(rawUri);
  const localFallbackUri = "mongodb://127.0.0.1:27017/shopnest";

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 10000,
        dbName: "shopnest", // Strictly enforce database name
      });
      console.log(`✅ MongoDB connected: ${conn.connection.host} | Database: ${conn.connection.name}`);
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
      dbName: "shopnest",
    });
    console.log(`Connected to local MongoDB fallback: ${conn.connection.host}/shopnest | Database: ${conn.connection.name}`);
  } catch (localError) {
    console.error("MongoDB connection failed for both primary and local instances:", localError.message);
    process.exit(1);
  }
};

module.exports = connectDB;
