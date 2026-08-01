import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import compression from "compression";
import morgan from "morgan";
import { fileURLToPath } from "url";
import path from "path";

import { connectDatabase, gracefulShutdown } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";
import { generalLimiter, authLimiter } from "./middlewares/rateLimiter.js";
import config from "./config/config.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// Uncaught Exception Handler
// ============================================================
process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err);
  console.error("Shutting down due to uncaught exception");
  gracefulShutdown();
});

// ============================================================
// Environment Configuration
// ============================================================
// Load environment variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: path.join(__dirname, "config", "config.env") });
}

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "DB_LOCAL_URI"];
if (process.env.NODE_ENV === "PRODUCTION") {
  requiredEnvVars.push("DB_URI");
}

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
  process.exit(1);
}

// ============================================================
// Database Connection
// ============================================================
connectDatabase();

// ============================================================
// Security Middleware
// ============================================================
// Set security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }),
);

// Enable CORS
app.use(
  cors({
    origin: config.frontendUrl || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

// Compression middleware
app.use(compression());

// Request logging
if (config.isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ============================================================
// Body Parsers
// ============================================================
// IMPORTANT: Webhook route must use raw body BEFORE JSON parser
// This is handled in the payment route registration

// JSON parser with raw body capture for webhooks
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      // Store raw body for webhook signature verification
      req.rawBody = buf.toString();
    },
  }),
);

// URL encoded parser
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
    verify: (req, res, buf) => {
      if (!req.rawBody) {
        req.rawBody = buf.toString();
      }
    },
  }),
);

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "price",
      "ratings",
      "stock",
      "category",
      "name",
      "sort",
      "fields",
      "page",
      "limit",
    ],
  }),
);

// ============================================================
// Rate Limiting
// ============================================================
// Apply general rate limit to all routes
app.use("/api", generalLimiter);

// Apply stricter rate limit to auth routes
app.use("/api/v1/register", authLimiter);
app.use("/api/v1/login", authLimiter);
app.use("/api/v1/password/forgot", authLimiter);

// ============================================================
// Routes
// ============================================================
// Import routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);

// Payment routes - Webhook route must be before JSON parser middleware
// But since we already have JSON parser, we need to handle webhook separately
// We'll register payment routes differently
import { stripeWebhook } from "./controllers/paymentControllers.js";
app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);
// Other payment routes with JSON parser
app.use("/api/v1", paymentRoutes);

// ============================================================
// Static Files & Frontend (Production)
// ============================================================
if (config.isProduction) {
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// ============================================================
// Error Handling Middleware
// ============================================================
app.use(errorMiddleware);

// ============================================================
// Start Server
// ============================================================
const PORT = config.port || 4000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Server started successfully!
   Port: ${PORT}
   Environment: ${config.nodeEnv}
   Frontend URL: ${config.frontendUrl}
   Database: ${config.db.getUri()}
  `);
});

// ============================================================
// Unhandled Rejection Handler
// ============================================================
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION:", err);
  console.error("Shutting down server due to unhandled promise rejection");

  server.close(() => {
    gracefulShutdown();
  });
});

// ============================================================
// Graceful Shutdown
// ============================================================
const shutdown = () => {
  console.log("Received shutdown signal. Closing server...");
  server.close(() => {
    gracefulShutdown();
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default app;
