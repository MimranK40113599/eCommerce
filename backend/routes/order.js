import express from "express";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
import {
  allOrders,
  deleteOrder,
  getOrderDetails,
  getSales,
  myOrders,
  newOrder,
  updateOrder,
  // getOrderStatistics, // Add this controller method
} from "../controllers/orderControllers.js";

const router = express.Router();

// ============================================================
// Protected Routes - User Orders
// ============================================================

/**
 * @route   POST /api/v1/orders/new
 * @desc    Create a new order
 * @access  Private
 */
router.route("/orders/new").post(isAuthenticatedUser, newOrder);

/**
 * @route   GET /api/v1/me/orders
 * @desc    Get current user's orders
 * @access  Private
 */
router.route("/me/orders").get(isAuthenticatedUser, myOrders);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get order details by ID
 * @access  Private (user who owns order or admin)
 */
router.route("/orders/:id").get(isAuthenticatedUser, getOrderDetails);

// ============================================================
// Admin Routes - Order Management
// ============================================================

/**
 * @route   GET /api/v1/admin/orders
 * @desc    Get all orders (Admin only)
 * @access  Private/Admin
 */
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allOrders);

/**
 * @route   PUT /api/v1/admin/orders/:id
 * @desc    Update order status (Admin only)
 * @access  Private/Admin
 *
 * @route   DELETE /api/v1/admin/orders/:id
 * @desc    Delete order (Admin only)
 * @access  Private/Admin
 */
router
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

/**
 * @route   GET /api/v1/admin/sales/statistics
 * @desc    Get sales statistics for a date range (Admin only)
 * @access  Private/Admin
 */
router
  .route("/admin/sales/statistics")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSales);

/**
 * @route   GET /api/v1/admin/orders/statistics
 * @desc    Get order statistics summary (Admin only)
 * @access  Private/Admin
 */
// router
//   .route("/admin/orders/statistics")
//   .get(
//     isAuthenticatedUser,
//     authorizeRoles("admin"),
//     getOrderStatistics
//   );

export default router;
