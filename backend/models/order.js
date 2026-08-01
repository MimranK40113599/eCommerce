import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Please provide shipping address"],
        trim: true,
        maxLength: [200, "Address cannot exceed 200 characters"],
      },
      city: {
        type: String,
        required: [true, "Please provide city"],
        trim: true,
        maxLength: [100, "City cannot exceed 100 characters"],
      },
      phoneNo: {
        type: String,
        required: [true, "Please provide phone number"],
        trim: true,
        validate: {
          validator: function (v) {
            // Basic phone number validation - can be customized for your region
            return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
              v,
            );
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      },
      zipCode: {
        type: String,
        required: [true, "Please provide zip code"],
        trim: true,
        validate: {
          validator: function (v) {
            // Basic zip code validation - accepts 5-digit or 5+4 format
            return /^[0-9]{5}(?:-[0-9]{4})?$/.test(v);
          },
          message: (props) => `${props.value} is not a valid zip code!`,
        },
      },
      country: {
        type: String,
        required: [true, "Please provide country"],
        trim: true,
        maxLength: [100, "Country cannot exceed 100 characters"],
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true, // Index for faster user order queries
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "Please provide product name"],
          trim: true,
          maxLength: [200, "Product name cannot exceed 200 characters"],
        },
        quantity: {
          type: Number,
          required: [true, "Please provide quantity"],
          min: [1, "Quantity must be at least 1"],
          max: [100, "Quantity cannot exceed 100 items per order"],
        },
        image: {
          type: String,
          required: [true, "Please provide product image"],
        },
        price: {
          type: Number,
          required: [true, "Please provide product price"],
          min: [0, "Price cannot be negative"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
          index: true, // Index for product order queries
        },
      },
    ],
    paymentMethod: {
      type: String,
      required: [true, "Please select payment method"],
      enum: {
        values: ["COD", "Card", "Bank Transfer"],
        message: "Please select: COD, Card, or Bank Transfer",
      },
    },
    paymentInfo: {
      id: {
        type: String,
        trim: true,
      },
      status: {
        type: String,
        trim: true,
      },
      paidAt: {
        type: Date,
      },
    },
    itemsPrice: {
      type: Number,
      required: [true, "Please provide items price"],
      min: [0, "Items price cannot be negative"],
    },
    taxAmount: {
      type: Number,
      required: [true, "Please provide tax amount"],
      min: [0, "Tax amount cannot be negative"],
    },
    shippingAmount: {
      type: Number,
      required: [true, "Please provide shipping amount"],
      min: [0, "Shipping amount cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Please provide total amount"],
      min: [0, "Total amount cannot be negative"],
    },
    orderStatus: {
      type: String,
      enum: {
        values: ["Processing", "Shipped", "Delivered", "Cancelled"],
        message: "Please select correct order status",
      },
      default: "Processing",
    },
    deliveredAt: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxLength: [500, "Cancellation reason cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ "orderItems.product": 1 });

// Pre-save middleware to normalize data
orderSchema.pre("save", function (next) {
  // Update shippedAt when status changes to Shipped
  if (this.isModified("orderStatus") && this.orderStatus === "Shipped") {
    this.shippedAt = new Date();
  }

  // Update deliveredAt when status changes to Delivered
  if (this.isModified("orderStatus") && this.orderStatus === "Delivered") {
    this.deliveredAt = new Date();
  }

  // Update cancelledAt when status changes to Cancelled
  if (this.isModified("orderStatus") && this.orderStatus === "Cancelled") {
    this.cancelledAt = new Date();
  }

  // Recalculate total amount if any price changes
  if (
    this.isModified("itemsPrice") ||
    this.isModified("taxAmount") ||
    this.isModified("shippingAmount")
  ) {
    const expectedTotal =
      this.itemsPrice + this.taxAmount + this.shippingAmount;
    if (Math.abs(this.totalAmount - expectedTotal) > 0.01) {
      this.totalAmount = expectedTotal;
    }
  }

  next();
});

// Virtual field: Check if order is cancellable
orderSchema.virtual("isCancellable").get(function () {
  return this.orderStatus === "Processing" || this.orderStatus === "Shipped";
});

// Virtual field: Check if order is completed
orderSchema.virtual("isCompleted").get(function () {
  return this.orderStatus === "Delivered" || this.orderStatus === "Cancelled";
});

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function () {
  return this.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);
};

// Instance method to cancel order
orderSchema.methods.cancelOrder = async function (reason) {
  if (!this.isCancellable) {
    throw new Error("Order cannot be cancelled in its current status");
  }

  this.orderStatus = "Cancelled";
  this.cancelledAt = new Date();
  this.cancellationReason = reason || "No reason provided";

  return this.save();
};

export default mongoose.model("Order", orderSchema);
