import ErrorHandler from "../utils/errorHandler.js";

// Custom error types for better handling
const ERROR_TYPES = {
  CAST_ERROR: "CastError",
  VALIDATION_ERROR: "ValidationError",
  DUPLICATE_KEY: 11000,
  JWT_ERROR: "JsonWebTokenError",
  TOKEN_EXPIRED: "TokenExpiredError",
  STRIPE_ERROR: "StripeError",
  MULTER_ERROR: "MulterError",
  RATE_LIMIT_ERROR: "RateLimitError",
};

export default (err, req, res, next) => {
  // Log the full error for debugging
  console.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
    status: err.statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?._id,
  });

  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
  };

  // Handle Invalid Mongoose ID Error
  if (err.name === ERROR_TYPES.CAST_ERROR) {
    const message = `Resource not found. Invalid: ${err?.path}`;
    error = new ErrorHandler(message, 404);
  }

  // Handle Validation Error - Format as user-friendly messages
  if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
    const messages = Object.values(err.errors).map((value) => value.message);
    const formattedMessage = messages.join(". ");
    error = new ErrorHandler(formattedMessage, 400);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === ERROR_TYPES.DUPLICATE_KEY) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} "${value}" already exists. Please use a different ${field}.`;
    error = new ErrorHandler(message, 400);
  }

  // Handle wrong JWT Error
  if (err.name === ERROR_TYPES.JWT_ERROR) {
    const message = `Invalid authentication token. Please login again.`;
    error = new ErrorHandler(message, 401);
  }

  // Handle expired JWT Error
  if (err.name === ERROR_TYPES.TOKEN_EXPIRED) {
    const message = `Your session has expired. Please login again.`;
    error = new ErrorHandler(message, 401);
  }

  // Handle Stripe Errors
  if (
    err.type === ERROR_TYPES.STRIPE_ERROR ||
    err.name === ERROR_TYPES.STRIPE_ERROR
  ) {
    const statusCode = err.statusCode || 400;
    const message =
      err.message || "Payment processing failed. Please try again.";
    error = new ErrorHandler(message, statusCode);
  }

  // Handle Multer Errors (File Upload)
  if (err.name === ERROR_TYPES.MULTER_ERROR) {
    let message = "File upload error. ";
    if (err.code === "LIMIT_FILE_SIZE") {
      message += "File size is too large.";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      message += "Too many files uploaded.";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message += "Unexpected file field.";
    } else {
      message += err.message || "Please check your file and try again.";
    }
    error = new ErrorHandler(message, 400);
  }

  // Handle Rate Limiting Errors
  if (err.name === ERROR_TYPES.RATE_LIMIT_ERROR || err.code === "RATE_LIMIT") {
    const message = "Too many requests. Please try again later.";
    error = new ErrorHandler(message, 429);
  }

  // Handle MongoDB Connection Errors
  if (err.name === "MongoNetworkError" || err.name === "MongoTimeoutError") {
    const message = "Database connection error. Please try again later.";
    error = new ErrorHandler(message, 503);
  }

  // Determine environment and send appropriate response
  const isDevelopment = process.env.NODE_ENV === "DEVELOPMENT";
  const isProduction =
    process.env.NODE_ENV === "PRODUCTION" || !process.env.NODE_ENV;

  if (isDevelopment) {
    // In development, send detailed error information
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: err,
      stack: err?.stack,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  } else if (isProduction) {
    // In production, send minimal error information
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.ERROR_CODE_ENABLED === "true" && { code: err.code }),
    });
  }
};
