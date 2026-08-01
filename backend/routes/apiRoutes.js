import express from "express";
import authRoutes from "./auth.js";
import orderRoutes from "./order.js";
import paymentRoutes from "./payment.js";
import productRoutes from "./products.js";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/products", productRoutes);

// 404 handler for undefined routes
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

export default router;
