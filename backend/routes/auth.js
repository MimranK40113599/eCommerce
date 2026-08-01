import express from "express";
import {
  allUsers,
  deleteUser,
  forgotPassword,
  getUserDetails,
  getUserProfile,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateUser,
  uploadAvatar,
} from "../controllers/authControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
// import { validateRequest } from "../middlewares/validation.js";
// import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// ============================================================
// Public Routes - Authentication & Authorization
// ============================================================

/**
 * @route   POST /api/v1/register
 * @desc    Register a new user
 * @access  Public
 */
router.route("/register").post(
  // authLimiter, // Rate limiting for registration
  registerUser,
);

/**
 * @route   POST /api/v1/login
 * @desc    Login user
 * @access  Public
 */
router.route("/login").post(
  // authLimiter, // Rate limiting for login
  loginUser,
);

/**
 * @route   POST /api/v1/logout
 * @desc    Logout user - clear JWT cookie
 * @access  Public
 */
router.route("/logout").post(logout); // Changed from GET to POST for security

// ============================================================
// Public Routes - Password Management
// ============================================================

/**
 * @route   POST /api/v1/password/forgot
 * @desc    Request password reset email
 * @access  Public
 */
router.route("/password/forgot").post(
  // authLimiter, // Rate limiting for password reset
  forgotPassword,
);

/**
 * @route   PUT /api/v1/password/reset/:token
 * @desc    Reset password using token
 * @access  Public
 */
router.route("/password/reset/:token").put(resetPassword);

// ============================================================
// Protected Routes - User Profile & Account Management
// ============================================================

/**
 * @route   GET /api/v1/me
 * @desc    Get current user profile
 * @access  Private
 */
router.route("/me").get(isAuthenticatedUser, getUserProfile);

/**
 * @route   PUT /api/v1/me/update
 * @desc    Update user profile (name, email)
 * @access  Private
 */
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

/**
 * @route   PUT /api/v1/password/update
 * @desc    Update user password
 * @access  Private
 */
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

/**
 * @route   PUT /api/v1/me/upload_avatar
 * @desc    Upload or update user avatar
 * @access  Private
 */
router.route("/me/upload_avatar").put(isAuthenticatedUser, uploadAvatar);

// ============================================================
// Admin Routes - User Management
// ============================================================

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

/**
 * @route   GET /api/v1/admin/users/:id
 * @desc    Get user details by ID (Admin only)
 * @access  Private/Admin
 *
 * @route   PUT /api/v1/admin/users/:id
 * @desc    Update user by ID (Admin only)
 * @access  Private/Admin
 *
 * @route   DELETE /api/v1/admin/users/:id
 * @desc    Delete user by ID (Admin only)
 * @access  Private/Admin
 */
router
  .route("/admin/users/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default router;
