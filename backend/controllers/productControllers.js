import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";

// Validation helpers
const validateRating = (rating) => {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
};

const validateProductData = (data) => {
  const required = ["name", "price", "description", "category", "stock"];
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  if (data.price < 0) throw new Error("Price cannot be negative");
  if (data.stock < 0) throw new Error("Stock cannot be negative");
  return true;
};

// Get products   =>  /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = parseInt(req.query.limit) || 4;
  const apiFilters = new APIFilters(Product, req.query).search().filters();

  let products = await apiFilters.query;
  let filteredProductsCount = products.length;

  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();

  res.status(200).json({
    success: true,
    resPerPage,
    filteredProductsCount,
    products,
  });
});

// Create new Product   =>  /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    validateProductData(req.body);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }

  req.body.user = req.user._id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get single product details   =>  /api/v1/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id).populate(
    "reviews.user",
    "name avatar",
  );

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Get products - ADMIN   =>  /api/v1/admin/products
export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    products,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
});

// Update product details   =>  /api/v1/admin/products/:id
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Validate stock update
  if (req.body.stock !== undefined && req.body.stock < 0) {
    return next(new ErrorHandler("Stock cannot be negative", 400));
  }

  // Validate price
  if (req.body.price !== undefined && req.body.price < 0) {
    return next(new ErrorHandler("Price cannot be negative", 400));
  }

  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Upload product images   =>  /api/v1/admin/products/:id/upload_images
export const uploadProductImages = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (
    !req.body?.images ||
    !Array.isArray(req.body.images) ||
    req.body.images.length === 0
  ) {
    return next(new ErrorHandler("Please provide at least one image", 400));
  }

  // Limit maximum images
  const MAX_IMAGES = 5;
  if (product.images.length + req.body.images.length > MAX_IMAGES) {
    return next(
      new ErrorHandler(`Maximum ${MAX_IMAGES} images allowed per product`, 400),
    );
  }

  const uploader = async (image) => upload_file(image, "shopit/products");

  let urls;
  try {
    urls = await Promise.all(req.body.images.map(uploader));
  } catch (error) {
    return next(new ErrorHandler("Failed to upload images", 500));
  }

  product.images.push(...urls);
  await product.save();

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete product image   =>  /api/v1/admin/products/:id/delete_image
export const deleteProductImage = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (!req.body.imgId) {
    return next(new ErrorHandler("Please provide image ID to delete", 400));
  }

  const isDeleted = await delete_file(req.body.imgId);

  if (isDeleted) {
    product.images = product.images.filter(
      (img) => img.public_id !== req.body.imgId,
    );
    await product.save();
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete product   =>  /api/v1/admin/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Check if product has any orders
  const hasOrders = await Order.findOne({
    "orderItems.product": product._id,
  });

  if (hasOrders) {
    return next(
      new ErrorHandler(
        "Cannot delete product that has existing orders. Consider archiving instead.",
        400,
      ),
    );
  }

  // Delete images from cloudinary
  if (product?.images && product.images.length > 0) {
    const deletePromises = product.images.map((img) =>
      delete_file(img.public_id).catch((err) => {
        console.error(`Failed to delete image ${img.public_id}:`, err);
      }),
    );
    await Promise.all(deletePromises);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Create/Update product review   =>  /api/v1/reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  if (!productId) {
    return next(new ErrorHandler("Product ID is required", 400));
  }

  if (!comment || comment.trim().length === 0) {
    return next(new ErrorHandler("Review comment is required", 400));
  }

  if (!rating || !validateRating(rating)) {
    return next(
      new ErrorHandler("Rating must be a number between 1 and 5", 400),
    );
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const userId = req?.user?._id;

  // Check if user has already reviewed
  const existingReviewIndex = product.reviews.findIndex(
    (r) => r.user.toString() === userId.toString(),
  );

  if (existingReviewIndex !== -1) {
    // Update existing review
    product.reviews[existingReviewIndex].comment = comment.trim();
    product.reviews[existingReviewIndex].rating = rating;
  } else {
    // Add new review
    product.reviews.push({
      user: userId,
      rating: rating,
      comment: comment.trim(),
    });
  }

  // Update product ratings
  product.numOfReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message:
      existingReviewIndex !== -1
        ? "Review updated successfully"
        : "Review added successfully",
  });
});

// Get product reviews   =>  /api/v1/reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const { id: productId } = req.query;

  if (!productId) {
    return next(new ErrorHandler("Product ID is required", 400));
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const product = await Product.findById(productId).populate(
    "reviews.user",
    "name avatar",
  );

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const totalReviews = product.reviews.length;
  const paginatedReviews = product.reviews
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(skip, skip + limit);

  res.status(200).json({
    success: true,
    reviews: paginatedReviews,
    pagination: {
      page,
      limit,
      totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
    },
    averageRating: product.ratings || 0,
    totalReviews,
  });
});

// Delete product review   =>  /api/v1/admin/reviews
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const { productId, id: reviewId } = req.query;

  if (!productId || !reviewId) {
    return next(new ErrorHandler("Product ID and Review ID are required", 400));
  }

  let product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== reviewId,
  );

  if (reviews.length === product.reviews.length) {
    return next(new ErrorHandler("Review not found", 404));
  }

  const numOfReviews = reviews.length;
  const ratings =
    numOfReviews === 0
      ? 0
      : reviews.reduce((acc, item) => acc + item.rating, 0) / numOfReviews;

  product = await Product.findByIdAndUpdate(
    productId,
    { reviews, numOfReviews, ratings },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

// Can user review   =>  /api/v1/can_review
export const canUserReview = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.query;

  if (!productId) {
    return next(new ErrorHandler("Product ID is required", 400));
  }

  // Check if user has purchased this product
  const orders = await Order.find({
    user: req.user._id,
    orderStatus: "Delivered",
    "orderItems.product": productId,
  });

  // Check if user has already reviewed
  const product = await Product.findById(productId);
  let hasReviewed = false;

  if (product) {
    hasReviewed = product.reviews.some(
      (r) => r.user.toString() === req.user._id.toString(),
    );
  }

  res.status(200).json({
    success: true,
    canReview: orders.length > 0 && !hasReviewed,
    hasPurchased: orders.length > 0,
    hasReviewed,
  });
});
