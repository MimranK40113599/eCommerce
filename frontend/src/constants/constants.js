/* // ============================================================
// Branding & App Information
// ============================================================
export const APP_NAME = "Hzaluna";
export const APP_DESCRIPTION =
  "Hzaluna Shopping Store - Your one-stop shop for electronics, fashion, and more.";
export const APP_URL = "https://hzaluna.com";
export const APP_EMAIL = "support@hzaluna.com";
export const APP_PHONE = "+1-800-HZALUNA";

// ============================================================
// API Configuration
// ============================================================
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:4000";

// ============================================================
// Pagination Defaults
// ============================================================
export const DEFAULT_PAGE_SIZE = 10;
export const PRODUCTS_PER_PAGE = 8;
export const DEFAULT_PAGE = 1;

// ============================================================
// Order Status
// ============================================================
export const ORDER_STATUS = {
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PROCESSING]: "bg-yellow-100 text-yellow-800",
  [ORDER_STATUS.SHIPPED]: "bg-blue-100 text-blue-800",
  [ORDER_STATUS.DELIVERED]: "bg-green-100 text-green-800",
  [ORDER_STATUS.CANCELLED]: "bg-red-100 text-red-800",
};

export const ORDER_STATUS_OPTIONS = [
  { value: ORDER_STATUS.PROCESSING, label: "Processing" },
  { value: ORDER_STATUS.SHIPPED, label: "Shipped" },
  { value: ORDER_STATUS.DELIVERED, label: "Delivered" },
  { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
];

// ============================================================
// Payment Methods
// ============================================================
export const PAYMENT_METHODS = {
  COD: "COD",
  CARD: "Card",
};

export const PAYMENT_METHOD_OPTIONS = [
  { value: PAYMENT_METHODS.COD, label: "Cash on Delivery" },
  { value: PAYMENT_METHODS.CARD, label: "Card Payment" },
];

// ============================================================
// User Roles
// ============================================================
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// ============================================================
// Local Storage Keys
// ============================================================
export const STORAGE_KEYS = {
  USER: "hzaluna_user",
  CART: "hzaluna_cart",
  TOKEN: "hzaluna_token",
};

// ============================================================
// Currency & Price Formatting
// ============================================================
export const CURRENCY = "USD";
export const CURRENCY_SYMBOL = "$";

export const formatPrice = (price) => {
  return `${CURRENCY_SYMBOL}${Number(price).toFixed(2)}`;
};

// ============================================================
// Product Categories
// ============================================================
export const CATEGORIES = [
  "Electronics",
  "Cameras",
  "Laptops",
  "Accessories",
  "Headphones",
  "Food",
  "Books",
  "Sports",
  "Outdoor",
  "Home",
  "Fashion",
  "Beauty",
  "Toys",
  "Health",
  "Automotive",
  "Pet Supplies",
];

// ============================================================
// API Endpoints
// ============================================================
export const ENDPOINTS = {
  // Auth
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",
  FORGOT_PASSWORD: "/password/forgot",
  RESET_PASSWORD: "/password/reset",
  UPDATE_PASSWORD: "/password/update",

  // User
  GET_PROFILE: "/me",
  UPDATE_PROFILE: "/me/update",
  UPLOAD_AVATAR: "/me/upload_avatar",

  // Products
  GET_PRODUCTS: "/products",
  GET_PRODUCT: "/products",
  ADMIN_PRODUCTS: "/admin/products",

  // Reviews
  CREATE_REVIEW: "/reviews",
  GET_REVIEWS: "/reviews",
  CAN_REVIEW: "/reviews/can_review",

  // Orders
  CREATE_ORDER: "/orders/new",
  GET_ORDERS: "/me/orders",
  GET_ORDER: "/orders",
  ADMIN_ORDERS: "/admin/orders",

  // Admin
  ADMIN_USERS: "/admin/users",
  ADMIN_SALES: "/admin/sales/statistics",

  // Payment
  CHECKOUT_SESSION: "/payment/checkout_session",
};

// ============================================================
// Form Validation Messages
// ============================================================
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL: "Please enter a valid email address",
  PASSWORD_MIN: "Password must be at least 8 characters",
  PASSWORD_MATCH: "Passwords do not match",
  PASSWORD_UPPERCASE: "Password must contain at least one uppercase letter",
  PASSWORD_LOWERCASE: "Password must contain at least one lowercase letter",
  PASSWORD_NUMBER: "Password must contain at least one number",
  PASSWORD_SPECIAL: "Password must contain at least one special character",
  PHONE: "Please enter a valid phone number",
  ZIP: "Please enter a valid zip code",
};

// ============================================================
// Toast Messages
// ============================================================
export const TOAST_MESSAGES = {
  // Auth
  LOGIN_SUCCESS: "Welcome back! You have been logged in successfully.",
  LOGIN_ERROR: "Invalid email or password. Please try again.",
  REGISTER_SUCCESS: "Account created successfully! Please login.",
  REGISTER_ERROR: "Registration failed. Please try again.",
  LOGOUT_SUCCESS: "You have been logged out successfully.",
  PASSWORD_UPDATE_SUCCESS: "Password updated successfully!",
  PASSWORD_UPDATE_ERROR: "Failed to update password.",
  PROFILE_UPDATE_SUCCESS: "Profile updated successfully!",
  PROFILE_UPDATE_ERROR: "Failed to update profile.",
  AVATAR_UPDATE_SUCCESS: "Avatar updated successfully!",
  AVATAR_UPDATE_ERROR: "Failed to update avatar.",
  FORGOT_PASSWORD_SUCCESS:
    "Password reset email sent! Please check your inbox.",
  FORGOT_PASSWORD_ERROR: "Failed to send reset email. Please try again.",
  RESET_PASSWORD_SUCCESS: "Password reset successfully! Please login.",
  RESET_PASSWORD_ERROR: "Invalid or expired reset token.",

  // Cart
  ADD_TO_CART_SUCCESS: "Item added to cart!",
  ADD_TO_CART_ERROR: "Failed to add item to cart.",
  REMOVE_FROM_CART_SUCCESS: "Item removed from cart.",
  CLEAR_CART_SUCCESS: "Cart cleared.",

  // Order
  ORDER_CREATE_SUCCESS: "Order placed successfully!",
  ORDER_CREATE_ERROR: "Failed to place order. Please try again.",
  ORDER_UPDATE_SUCCESS: "Order updated successfully!",
  ORDER_UPDATE_ERROR: "Failed to update order.",
  ORDER_DELETE_SUCCESS: "Order deleted successfully!",
  ORDER_DELETE_ERROR: "Failed to delete order.",

  // Product
  PRODUCT_CREATE_SUCCESS: "Product created successfully!",
  PRODUCT_CREATE_ERROR: "Failed to create product.",
  PRODUCT_UPDATE_SUCCESS: "Product updated successfully!",
  PRODUCT_UPDATE_ERROR: "Failed to update product.",
  PRODUCT_DELETE_SUCCESS: "Product deleted successfully!",
  PRODUCT_DELETE_ERROR: "Failed to delete product.",
  REVIEW_CREATE_SUCCESS: "Review submitted successfully!",
  REVIEW_CREATE_ERROR: "Failed to submit review.",
  REVIEW_DELETE_SUCCESS: "Review deleted successfully!",
  REVIEW_DELETE_ERROR: "Failed to delete review.",

  // General
  SOMETHING_WRONG: "Something went wrong. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Please login to continue.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "Resource not found.",
};
 */

export const APP_NAME = "Hzaluna";
export const APP_DESCRIPTION =
  "Hzaluna Shopping Store - Your one-stop shop for electronics, fashion, and more.";
export const APP_URL = "https://hzaluna.com";
export const APP_EMAIL = "support@hzaluna.com";

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:4000";

export const DEFAULT_PAGE_SIZE = 10;
export const PRODUCTS_PER_PAGE = 8;
export const DEFAULT_PAGE = 1;

export const ORDER_STATUS = {
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_OPTIONS = [
  { value: ORDER_STATUS.PROCESSING, label: "Processing" },
  { value: ORDER_STATUS.SHIPPED, label: "Shipped" },
  { value: ORDER_STATUS.DELIVERED, label: "Delivered" },
  { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
];

export const PAYMENT_METHODS = {
  COD: "COD",
  CARD: "Card",
};

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

export const STORAGE_KEYS = {
  USER: "hzaluna_user",
  CART: "hzaluna_cart",
  TOKEN: "hzaluna_token",
};

export const CURRENCY = "USD";
export const CURRENCY_SYMBOL = "$";

export const formatPrice = (price) => {
  return `${CURRENCY_SYMBOL}${Number(price).toFixed(2)}`;
};

export const CATEGORIES = [
  "Electronics",
  "Cameras",
  "Laptops",
  "Accessories",
  "Headphones",
  "Food",
  "Books",
  "Sports",
  "Outdoor",
  "Home",
  "Fashion",
  "Beauty",
  "Toys",
  "Health",
  "Automotive",
  "Pet Supplies",
];

export const ENDPOINTS = {
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",
  FORGOT_PASSWORD: "/password/forgot",
  RESET_PASSWORD: "/password/reset",
  UPDATE_PASSWORD: "/password/update",
  GET_PROFILE: "/me",
  UPDATE_PROFILE: "/me/update",
  UPLOAD_AVATAR: "/me/upload_avatar",
  GET_PRODUCTS: "/products",
  GET_PRODUCT: "/products",
  ADMIN_PRODUCTS: "/admin/products",
  CREATE_REVIEW: "/reviews",
  GET_REVIEWS: "/reviews",
  CAN_REVIEW: "/reviews/can_review",
  CREATE_ORDER: "/orders/new",
  GET_ORDERS: "/me/orders",
  GET_ORDER: "/orders",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_USERS: "/admin/users",
  ADMIN_SALES: "/admin/sales/statistics",
  CHECKOUT_SESSION: "/payment/checkout_session",
};
