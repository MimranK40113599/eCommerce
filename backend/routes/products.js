import express from "express";
import {
  canUserReview,
  createProductReview,
  deleteProduct,
  deleteProductImage,
  deleteReview,
  getAdminProducts,
  getProductDetails,
  getProductReviews,
  getProducts,
  newProduct,
  updateProduct,
  uploadProductImages,
  // getFeaturedProducts, // Add this controller method
  // searchProducts, // Add this controller method
} from "../controllers/productControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

// ============================================================
// Public Routes - Product Listing & Search
// ============================================================

/**
 * @route   GET /api/v1/products
 * @desc    Get all products with filtering, sorting, pagination
 * @access  Public
 */
router.route("/products").get(getProducts);

/**
 * @route   GET /api/v1/products/featured
 * @desc    Get featured products
 * @access  Public
 */
// router.route("/products/featured").get(getFeaturedProducts);

/**
 * @route   GET /api/v1/products/search
 * @desc    Search products by keyword
 * @access  Public
 */
// router.route("/products/search").get(searchProducts);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get single product details
 * @access  Public
 */
router.route("/products/:id").get(getProductDetails);

// ============================================================
// Protected Routes - Product Reviews
// ============================================================

/**
 * @route   PUT /api/v1/reviews
 * @desc    Create or update product review
 * @access  Private
 */
router.route("/reviews").put(isAuthenticatedUser, createProductReview);

/**
 * @route   GET /api/v1/reviews
 * @desc    Get product reviews
 * @access  Private
 */
router.route("/reviews").get(isAuthenticatedUser, getProductReviews);

/**
 * @route   GET /api/v1/reviews/can_review
 * @desc    Check if user can review a product
 * @access  Private
 */
router.route("/reviews/can_review").get(isAuthenticatedUser, canUserReview);

/**
 * @route   DELETE /api/v1/admin/reviews
 * @desc    Delete product review (Admin only)
 * @access  Private/Admin
 */
router
  .route("/admin/reviews")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

// ============================================================
// Admin Routes - Product Management
// ============================================================

/**
 * @route   POST /api/v1/admin/products
 * @desc    Create a new product (Admin only)
 * @access  Private/Admin
 *
 * @route   GET /api/v1/admin/products
 * @desc    Get all products for admin (Admin only)
 * @access  Private/Admin
 */
router
  .route("/admin/products")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct)
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

/**
 * @route   PUT /api/v1/admin/products/:id
 * @desc    Update product details (Admin only)
 * @access  Private/Admin
 *
 * @route   DELETE /api/v1/admin/products/:id
 * @desc    Delete product (Admin only)
 * @access  Private/Admin
 */
router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

/**
 * @route   PUT /api/v1/admin/products/:id/upload_images
 * @desc    Upload product images (Admin only)
 * @access  Private/Admin
 */
router
  .route("/admin/products/:id/upload_images")
  .put(isAuthenticatedUser, authorizeRoles("admin"), uploadProductImages);

/**
 * @route   PUT /api/v1/admin/products/:id/delete_image
 * @desc    Delete product image (Admin only)
 * @access  Private/Admin
 */
router
  .route("/admin/products/:id/delete_image")
  .put(isAuthenticatedUser, authorizeRoles("admin"), deleteProductImage);

export default router;
