/* 
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 Database connection configuration
/
const dbConfig = {
  // Connection options for production
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    retryWrites: true,
    retryReads: true,
  },
  // Retry configuration
  retry: {
    maxRetries: 5,
    initialDelay: 1000,
    maxDelay: 30000,
  },
};

 Validate database configuration
/
const validateConfig = () => {
  const nodeEnv = process.env.NODE_ENV || "DEVELOPMENT";

  let DB_URI = "";

  if (nodeEnv === "DEVELOPMENT") {
    DB_URI = process.env.DB_LOCAL_URI;
  } else if (nodeEnv === "PRODUCTION") {
    DB_URI = process.env.DB_URI;
  } else {
    console.warn(`Unknown NODE_ENV: ${nodeEnv}, falling back to DEVELOPMENT`);
    DB_URI = process.env.DB_LOCAL_URI;
  }

  if (!DB_URI) {
    throw new Error(
      `Database URI not configured for environment: ${nodeEnv}. ` +
        `Please check your .env file.`,
    );
  }

  return { DB_URI, nodeEnv };
};

 Get connection options based on environment
/
const getConnectionOptions = (nodeEnv) => {
  const options = { ...dbConfig.options };

  // Production-specific options
  if (nodeEnv === "PRODUCTION") {
    options.ssl = true;
    options.retryWrites = true;
    options.retryReads = true;
  }

  // Development-specific options
  if (nodeEnv === "DEVELOPMENT") {
    options.debug = false;
  }

  return options;
};

 Setup connection event listeners
/
const setupConnectionListeners = (connection) => {
  connection.on("connected", () => {
    console.log(`MongoDB Database connected with HOST: ${connection.host}`);
  });

  connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
  });

  connection.on("reconnected", () => {
    console.log("MongoDB reconnected successfully");
  });

  connection.on("close", () => {
    console.log("MongoDB connection closed");
  });
};

 Connect to database with retry logic
/
export const connectDatabase = async () => {
  try {
    // Validate configuration
    const { DB_URI, nodeEnv } = validateConfig();

    // Get connection options
    const options = getConnectionOptions(nodeEnv);

    console.log(`Connecting to MongoDB (${nodeEnv} mode)...`);

    // Attempt connection with retry
    let lastError = null;
    let connection = null;

    for (let attempt = 1; attempt <= dbConfig.retry.maxRetries; attempt++) {
      try {
        // Connect to database
        connection = await mongoose.connect(DB_URI, options);

        // Setup event listeners
        setupConnectionListeners(mongoose.connection);

        // Log success
        const host = connection.connection.host;
        const port = connection.connection.port || "default";
        const dbName = connection.connection.name;

        console.log(
          `✅ MongoDB Database connected successfully!`,
          `\n   Host: ${host}`,
          `\n   Port: ${port}`,
          `\n   Database: ${dbName}`,
          `\n   Environment: ${nodeEnv}`,
        );

        return connection;
      } catch (error) {
        lastError = error;

        // Calculate delay with exponential backoff
        const delay = Math.min(
          dbConfig.retry.initialDelay Math.pow(2, attempt - 1),
          dbConfig.retry.maxDelay,
        );

        console.warn(
          `MongoDB connection attempt ${attempt}/${dbConfig.retry.maxRetries} failed:`,
          error.message,
        );

        if (attempt < dbConfig.retry.maxRetries) {
          console.log(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    throw new Error(
      `Failed to connect to MongoDB after ${dbConfig.retry.maxRetries} attempts. ` +
        `Last error: ${lastError?.message || "Unknown error"}`,
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

 Disconnect from database gracefully
/
export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected gracefully");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error.message);
    throw error;
  }
};

 Check database connection health
/
export const checkDatabaseHealth = async () => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return {
      isConnected: state === 1,
      state: states[state] || "unknown",
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      models: Object.keys(mongoose.models),
    };
  } catch (error) {
    return {
      isConnected: false,
      error: error.message,
    };
  }
};

//  Handle graceful shutdown
export const gracefulShutdown = async () => {
  console.log("Received shutdown signal. Closing database connections...");

  try {
    await disconnectDatabase();
    console.log("Database connections closed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

// Setup graceful shutdown handlers
const setupGracefulShutdown = () => {
  const signals = ["SIGTERM", "SIGINT", "SIGUSR2"];

  signals.forEach((signal) => {
    process.on(signal, gracefulShutdown);
  });
};

// Auto-setup graceful shutdown if in production
if (process.env.NODE_ENV === "PRODUCTION") {
  setupGracefulShutdown();
}

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await gracefulShutdown();
});

// Handle unhandled rejections
process.on("unhandledRejection", async (err) => {
  console.error("Unhandled Rejection:", err);
  await gracefulShutdown();
});

export default {
  connectDatabase,
  disconnectDatabase,
  checkDatabaseHealth,
  gracefulShutdown,
}; */

/* 











*/

import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Database connection configuration
 */
const dbConfig = {
  // Connection options for production
  options: {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    retryWrites: true,
    retryReads: true,
  },
  // Retry configuration
  retry: {
    maxRetries: 5,
    initialDelay: 1000,
    maxDelay: 30000,
  },
};

/**
 * Validate database configuration
 */
const validateConfig = () => {
  const nodeEnv = process.env.NODE_ENV || "DEVELOPMENT";

  let DB_URI = "";

  if (nodeEnv === "DEVELOPMENT") {
    DB_URI = process.env.DB_LOCAL_URI;
  } else if (nodeEnv === "PRODUCTION") {
    DB_URI = process.env.DB_URI;
  } else {
    console.warn(`Unknown NODE_ENV: ${nodeEnv}, falling back to DEVELOPMENT`);
    DB_URI = process.env.DB_LOCAL_URI;
  }

  if (!DB_URI) {
    throw new Error(
      `Database URI not configured for environment: ${nodeEnv}. ` +
        `Please check your .env file.`,
    );
  }

  return { DB_URI, nodeEnv };
};

/**
 * Get connection options based on environment
 */
const getConnectionOptions = (nodeEnv) => {
  const options = { ...dbConfig.options };

  // Production-specific options
  if (nodeEnv === "PRODUCTION") {
    options.ssl = true;
    options.retryWrites = true;
    options.retryReads = true;
  }

  // Enable debugging in development (Mongoose 7.x way)
  if (nodeEnv === "DEVELOPMENT") {
    mongoose.set("debug", false); // Set to true for verbose query logging
  }

  return options;
};

/**
 * Setup connection event listeners
 */
const setupConnectionListeners = (connection) => {
  connection.on("connected", () => {
    console.log(`✅ MongoDB Database connected with HOST: ${connection.host}`);
  });

  connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

  connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
  });

  connection.on("reconnected", () => {
    console.log("✅ MongoDB reconnected successfully");
  });

  connection.on("close", () => {
    console.log("MongoDB connection closed");
  });
};

/**
 * Connect to database with retry logic
 */
export const connectDatabase = async () => {
  try {
    // Validate configuration
    const { DB_URI, nodeEnv } = validateConfig();

    // Get connection options
    const options = getConnectionOptions(nodeEnv);

    console.log(`🔗 Connecting to MongoDB (${nodeEnv} mode)...`);

    // Attempt connection with retry
    let lastError = null;
    let connection = null;

    for (let attempt = 1; attempt <= dbConfig.retry.maxRetries; attempt++) {
      try {
        // Connect to database
        connection = await mongoose.connect(DB_URI, options);

        // Setup event listeners
        setupConnectionListeners(mongoose.connection);

        // Log success
        const host = connection.connection.host;
        const port = connection.connection.port || "default";
        const dbName = connection.connection.name;

        console.log(
          `✅ MongoDB Database connected successfully!`,
          `\n   Host: ${host}`,
          `\n   Port: ${port}`,
          `\n   Database: ${dbName}`,
          `\n   Environment: ${nodeEnv}`,
        );

        return connection;
      } catch (error) {
        lastError = error;

        // Calculate delay with exponential backoff
        const delay = Math.min(
          dbConfig.retry.initialDelay * Math.pow(2, attempt - 1),
          dbConfig.retry.maxDelay,
        );

        console.warn(
          `⚠️ MongoDB connection attempt ${attempt}/${dbConfig.retry.maxRetries} failed:`,
          error.message,
        );

        if (attempt < dbConfig.retry.maxRetries) {
          console.log(`🔄 Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    throw new Error(
      `Failed to connect to MongoDB after ${dbConfig.retry.maxRetries} attempts. ` +
        `Last error: ${lastError?.message || "Unknown error"}`,
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

/**
 * Disconnect from database gracefully
 */
export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected gracefully");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error.message);
    throw error;
  }
};

/**
 * Check database connection health
 */
export const checkDatabaseHealth = async () => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return {
      isConnected: state === 1,
      state: states[state] || "unknown",
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      models: Object.keys(mongoose.models),
    };
  } catch (error) {
    return {
      isConnected: false,
      error: error.message,
    };
  }
};

/**
 * Handle graceful shutdown
 */
export const gracefulShutdown = async () => {
  console.log("🛑 Received shutdown signal. Closing database connections...");

  try {
    await disconnectDatabase();
    console.log("✅ Database connections closed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during graceful shutdown:", error);
    process.exit(1);
  }
};

// Setup graceful shutdown handlers
const setupGracefulShutdown = () => {
  const signals = ["SIGTERM", "SIGINT", "SIGUSR2"];

  signals.forEach((signal) => {
    process.on(signal, gracefulShutdown);
  });
};

// Auto-setup graceful shutdown if in production
if (process.env.NODE_ENV === "PRODUCTION") {
  setupGracefulShutdown();
}

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("❌ Uncaught Exception:", err);
  await gracefulShutdown();
});

// Handle unhandled rejections
process.on("unhandledRejection", async (err) => {
  console.error("❌ Unhandled Rejection:", err);
  await gracefulShutdown();
});

export default {
  connectDatabase,
  disconnectDatabase,
  checkDatabaseHealth,
  gracefulShutdown,
};
