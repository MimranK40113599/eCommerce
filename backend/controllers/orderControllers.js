import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import mongoose from "mongoose";

// Validation helpers
const validateOrderStatus = (status) => {
  const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
  return validStatuses.includes(status);
};

// Create new Order  =>  /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  // Validation
  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorHandler("Order must contain at least one item", 400));
  }

  if (
    !shippingInfo ||
    !shippingInfo.address ||
    !shippingInfo.city ||
    !shippingInfo.country
  ) {
    return next(
      new ErrorHandler("Please provide complete shipping information", 400),
    );
  }

  if (!paymentMethod) {
    return next(new ErrorHandler("Please provide payment method", 400));
  }

  // Validate each order item has product
  for (const item of orderItems) {
    if (!item.product) {
      return next(
        new ErrorHandler("Each order item must have a product ID", 400),
      );
    }
  }

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get current user orders  =>  /api/v1/me/orders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, totalCount] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ user: req.user._id }),
  ]);

  res.status(200).json({
    success: true,
    orders,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
});

// Get order details  =>  /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name price images");

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // Check if user is authorized to view this order
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorHandler("You are not authorized to view this order", 403),
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get all orders - ADMIN  =>  /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, totalCount] = await Promise.all([
    Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    orders,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
});

// Update Order - ADMIN  =>  /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;

  if (!status || !validateOrderStatus(status)) {
    return next(
      new ErrorHandler(
        "Please provide a valid status: Processing, Shipped, Delivered, or Cancelled",
        400,
      ),
    );
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // Prevent updating delivered or cancelled orders
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Cannot update a delivered order", 400));
  }

  if (order.orderStatus === "Cancelled") {
    return next(new ErrorHandler("Cannot update a cancelled order", 400));
  }

  // If updating to Delivered or Cancelled, process stock updates
  if (status === "Delivered") {
    // Use session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const bulkOps = [];
      let productNotFound = false;

      for (const item of order.orderItems) {
        const product = await Product.findById(item.product).session(session);
        if (!product) {
          productNotFound = true;
          break;
        }

        if (product.stock < item.quantity) {
          await session.abortTransaction();
          session.endSession();
          return next(
            new ErrorHandler(
              `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`,
              400,
            ),
          );
        }

        bulkOps.push({
          updateOne: {
            filter: { _id: item.product },
            update: { $inc: { stock: -item.quantity } },
          },
        });
      }

      if (productNotFound) {
        await session.abortTransaction();
        session.endSession();
        return next(new ErrorHandler("One or more products not found", 404));
      }

      if (bulkOps.length > 0) {
        await Product.bulkWrite(bulkOps, { session });
      }

      order.orderStatus = status;
      order.deliveredAt = Date.now();
      await order.save({ session });

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } else {
    // For other statuses (Processing, Shipped), just update the order
    order.orderStatus = status;
    if (status === "Shipped") {
      order.shippedAt = Date.now();
    }
    await order.save();
  }

  // Log admin action
  console.log(
    `Order ${order._id} updated to ${status} by admin ${req.user._id}`,
  );

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
  });
});

// Delete order - ADMIN  =>  /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // Prevent deleting delivered or processing orders (soft delete preference)
  if (order.orderStatus === "Delivered" || order.orderStatus === "Processing") {
    return next(
      new ErrorHandler(`Cannot delete ${order.orderStatus} orders`, 400),
    );
  }

  await order.deleteOne();

  // Log admin action
  console.log(`Order ${order._id} deleted by admin ${req.user._id}`);

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

// Internal helper function - not exported
async function getSalesData(startDate, endDate) {
  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        orderStatus: { $ne: "Cancelled" }, // Exclude cancelled orders
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalSales: { $sum: "$totalAmount" },
        numOrders: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.date": 1 },
    },
  ]);

  const salesMap = new Map();
  let totalSales = 0;
  let totalNumOrders = 0;

  salesData.forEach((entry) => {
    const date = entry?._id.date;
    const sales = entry?.totalSales || 0;
    const numOrders = entry?.numOrders || 0;

    salesMap.set(date, { sales, numOrders });
    totalSales += sales;
    totalNumOrders += numOrders;
  });

  const datesBetween = getDatesBetween(startDate, endDate);

  const finalSalesData = datesBetween.map((date) => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
  }));

  return { salesData: finalSalesData, totalSales, totalNumOrders };
}

function getDatesBetween(startDate, endDate) {
  const dates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Reset time to start of day
  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(0, 0, 0, 0);

  let currentDate = new Date(start);

  while (currentDate <= end) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Get Sales Data  =>  /api/v1/admin/get_sales
export const getSales = catchAsyncErrors(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return next(new ErrorHandler("Please provide startDate and endDate", 400));
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return next(
      new ErrorHandler("Invalid date format. Please use YYYY-MM-DD", 400),
    );
  }

  if (start > end) {
    return next(new ErrorHandler("Start date must be before end date", 400));
  }

  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(23, 59, 59, 999);

  const { salesData, totalSales, totalNumOrders } = await getSalesData(
    start,
    end,
  );

  res.status(200).json({
    success: true,
    totalSales,
    totalNumOrders,
    sales: salesData,
  });
});
