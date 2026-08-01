import { validationResult, body, param, query } from "express-validator";

// Middleware to handle validation errors
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validation rules for user registration
export const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),
];

// Validation rules for login
export const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Validation rules for order creation
export const orderValidation = [
  body("orderItems")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),
  body("orderItems.*.product").isMongoId().withMessage("Invalid product ID"),
  body("orderItems.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("shippingInfo.address")
    .notEmpty()
    .withMessage("Shipping address is required"),
  body("shippingInfo.city").notEmpty().withMessage("City is required"),
  body("shippingInfo.country").notEmpty().withMessage("Country is required"),
  body("shippingInfo.phoneNo")
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  body("paymentMethod")
    .isIn(["COD", "Card"])
    .withMessage("Invalid payment method"),
];

// Validation rules for product creation
export const productValidation = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Product name is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive number"),
];

// Validation rules for review
export const reviewValidation = [
  body("productId").isMongoId().withMessage("Invalid product ID"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Review comment is required"),
];
