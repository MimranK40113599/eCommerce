import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Checks if user is authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists in database
    const user = await User.findById(decoded.id);

    if (!user) {
      // Log authentication attempt with non-existent user
      console.warn(
        `Authentication attempt with invalid user ID: ${decoded.id} from IP: ${req.ip}`,
      );
      return next(
        new ErrorHandler("User no longer exists. Please login again.", 401),
      );
    }

    // Optional: Check if user is active (if you have an 'active' or 'isActive' field)
    // if (user.isActive === false) {
    //   return next(new ErrorHandler("Your account has been deactivated. Please contact support.", 403));
    // }

    // Optional: Check if token was issued before password change
    // if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
    //   return next(new ErrorHandler("Password was recently changed. Please login again.", 401));
    // }

    // Attach user to request
    req.user = user;

    // Log successful authentication (optional - can be enabled for audit)
    // console.log(`User authenticated: ${user.email} (${user._id}) from IP: ${req.ip}`);

    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      console.warn(`Invalid JWT token attempt from IP: ${req.ip}`);
      return next(
        new ErrorHandler(
          "Invalid authentication token. Please login again.",
          401,
        ),
      );
    }

    if (error.name === "TokenExpiredError") {
      console.warn(`Expired JWT token attempt from IP: ${req.ip}`);
      return next(
        new ErrorHandler("Your session has expired. Please login again.", 401),
      );
    }

    // Re-throw other errors
    throw error;
  }
});

// Authorize user roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Authentication required", 401));
    }

    if (!roles.includes(req.user.role)) {
      // Log authorization failure
      console.warn(
        `Authorization failed for user ${req.user.email} (${req.user._id}) with role ${req.user.role}. Required roles: ${roles.join(", ")}`,
      );

      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403,
        ),
      );
    }

    next();
  };
};

// Optional: Middleware to check if user has specific permissions
export const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Authentication required", 401));
    }

    // This assumes you have a permissions system in place
    // You can expand this based on your needs
    if (req.user.role === "admin") {
      return next();
    }

    // Check if user has specific permission
    if (req.user.permissions && req.user.permissions.includes(permission)) {
      return next();
    }

    return next(
      new ErrorHandler(
        `You don't have permission to perform this action: ${permission}`,
        403,
      ),
    );
  };
};
