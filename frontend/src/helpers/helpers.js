import { CURRENCY_SYMBOL } from "../constants/constants";

// ============================================================
// Price Formatting
// ============================================================
export const formatPrice = (price) => {
  if (!price && price !== 0) return `${CURRENCY_SYMBOL}0.00`;
  return `${CURRENCY_SYMBOL}${Number(price).toFixed(2)}`;
};

export const formatPriceWithDiscount = (price, discount) => {
  if (!discount || discount === 0) return formatPrice(price);
  const discountedPrice = price - (price * discount) / 100;
  return {
    original: formatPrice(price),
    discounted: formatPrice(discountedPrice),
    savings: formatPrice(price - discountedPrice),
  };
};

// ============================================================
// Date Formatting
// ============================================================
export const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const timeAgo = (date) => {
  if (!date) return "N/A";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval > 1 ? "s" : ""} ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval > 1 ? "s" : ""} ago`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval > 1 ? "s" : ""} ago`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval > 1 ? "s" : ""} ago`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval > 1 ? "s" : ""} ago`;
  return "Just now";
};

// ============================================================
// String Utilities
// ============================================================
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

// ============================================================
// Array & Object Utilities
// ============================================================
export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, ascending = true) => {
  if (!Array.isArray(array)) return [];
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
};

// ============================================================
// Validation Utilities
// ============================================================
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
};

export const validateZipCode = (zip) => {
  const re = /^[0-9]{5}(?:-[0-9]{4})?$/;
  return re.test(zip);
};

export const validatePassword = (password) => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  return {
    isValid:
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar &&
      isLongEnough,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    isLongEnough,
  };
};

// ============================================================
// Local Storage Helpers
// ============================================================
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

// ============================================================
// Image URL Helpers
// ============================================================
export const getImageUrl = (image) => {
  if (!image) return "/images/placeholder.png";
  if (typeof image === "string") return image;
  if (image?.url) return image.url;
  return "/images/placeholder.png";
};

export const getAvatarUrl = (avatar) => {
  if (!avatar) return "/images/default-avatar.png";
  if (typeof avatar === "string") return avatar;
  if (avatar?.url) return avatar.url;
  return "/images/default-avatar.png";
};

// ============================================================
// Rating Helpers
// ============================================================
export const getStarRating = (rating) => {
  if (!rating) return 0;
  return Math.round(rating * 2) / 2; // Round to nearest 0.5
};

export const getRatingPercentage = (rating) => {
  if (!rating) return 0;
  return Math.round((rating / 5) * 100);
};

// ============================================================
// Order Status Helpers
// ============================================================
export const getOrderStatusColor = (status) => {
  const colors = {
    Processing: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export const getOrderStatusBadge = (status) => {
  const badges = {
    Processing: "🔄 Processing",
    Shipped: "📦 Shipped",
    Delivered: "✅ Delivered",
    Cancelled: "❌ Cancelled",
  };
  return badges[status] || status;
};

// ============================================================
// Error Handling Helpers
// ============================================================
export const getErrorMessage = (error) => {
  if (!error) return "An unknown error occurred";
  if (typeof error === "string") return error;
  if (error?.data?.message) return error.data.message;
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
};

export const getErrorStatus = (error) => {
  if (error?.status) return error.status;
  if (error?.data?.statusCode) return error.data.statusCode;
  if (error?.response?.status) return error.response.status;
  return 500;
};

// ============================================================
// Cart Helpers
// ============================================================
export const calculateCartTotal = (cartItems) => {
  if (!cartItems || cartItems.length === 0) return 0;
  return cartItems.reduce((total, item) => {
    return total + (item.price || 0) * (item.quantity || 0);
  }, 0);
};

export const calculateCartItemCount = (cartItems) => {
  if (!cartItems || cartItems.length === 0) return 0;
  return cartItems.reduce((count, item) => count + (item.quantity || 0), 0);
};

// ============================================================
// Pagination Helpers
// ============================================================
export const getPaginationRange = (currentPage, totalPages, maxVisible = 5) => {
  const range = [];
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (end - start + 1 < maxVisible) {
    if (start === 1) {
      end = Math.min(totalPages, start + maxVisible - 1);
    } else if (end === totalPages) {
      start = Math.max(1, end - maxVisible + 1);
    }
  }

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  return range;
};

// ============================================================
// File Upload Helpers
// ============================================================
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const getFileExtension = (filename) => {
  if (!filename) return "";
  return filename.split(".").pop()?.toLowerCase() || "";
};

export const isImageFile = (filename) => {
  const extensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
  return extensions.includes(getFileExtension(filename));
};

export const getFileSizeInMB = (bytes) => {
  if (!bytes) return 0;
  return (bytes / (1024 * 1024)).toFixed(2);
};

// ============================================================
// Scroll Helpers
// ============================================================
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
