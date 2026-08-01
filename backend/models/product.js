import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
      maxLength: [200, "Product name cannot exceed 200 characters"],
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      min: [0, "Product price cannot be negative"],
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: "Product price must be greater than 0",
      },
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
      trim: true,
      maxLength: [5000, "Description cannot exceed 5000 characters"],
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: "Product image",
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please enter product category"],
      enum: {
        values: [
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
        ],
        message: "Please select correct category",
      },
    },
    seller: {
      type: String,
      required: [true, "Please enter product seller"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      min: [0, "Stock cannot be negative"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
      min: [0, "Number of reviews cannot be negative"],
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: [true, "Please provide rating"],
          min: [1, "Rating must be at least 1"],
          max: [5, "Rating cannot exceed 5"],
        },
        comment: {
          type: String,
          required: [true, "Please provide review comment"],
          trim: true,
          maxLength: [1000, "Review comment cannot exceed 1000 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Text index for search functionality
productSchema.index(
  { name: "text", description: "text", tags: "text" },
  {
    weights: {
      name: 10,
      description: 5,
      tags: 8,
    },
    name: "product_search",
  },
);

// Indexes for better query performance
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ "reviews.user": 1 });

// Pre-save middleware to generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Ensure slug uniqueness
    this.constructor
      .findOne({ slug: this.slug })
      .then((existingProduct) => {
        if (
          existingProduct &&
          existingProduct._id.toString() !== this._id.toString()
        ) {
          this.slug = `${this.slug}-${Date.now().toString().slice(-6)}`;
        }
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
});

// Pre-save middleware to update numOfReviews and ratings
productSchema.pre("save", function (next) {
  if (this.isModified("reviews")) {
    this.numOfReviews = this.reviews.length;
    if (this.reviews.length > 0) {
      const totalRating = this.reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      this.ratings = totalRating / this.reviews.length;
      // Round to 1 decimal place
      this.ratings = Math.round(this.ratings * 10) / 10;
    } else {
      this.ratings = 0;
    }
  }
  next();
});

// Virtual field: Discounted price
productSchema.virtual("discountedPrice").get(function () {
  if (this.discount > 0) {
    return Math.round((this.price * (100 - this.discount)) / 100);
  }
  return this.price;
});

// Virtual field: In stock
productSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});

// Virtual field: Average rating rounded
productSchema.virtual("averageRating").get(function () {
  if (this.ratings > 0) {
    return Math.round(this.ratings * 10) / 10;
  }
  return 0;
});

// Static method to get products by category
productSchema.statics.findByCategory = function (category, limit = 10) {
  return this.find({ category, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get featured products
productSchema.statics.getFeatured = function (limit = 8) {
  return this.find({ isActive: true, stock: { $gt: 0 } })
    .sort({ ratings: -1, numOfReviews: -1 })
    .limit(limit);
};

// Instance method to reduce stock
productSchema.methods.reduceStock = async function (quantity) {
  if (this.stock < quantity) {
    throw new Error(
      `Insufficient stock. Available: ${this.stock}, Requested: ${quantity}`,
    );
  }
  this.stock -= quantity;
  return this.save();
};

// Instance method to increase stock
productSchema.methods.increaseStock = async function (quantity) {
  this.stock += quantity;
  return this.save();
};

// Instance method to get review summary
productSchema.methods.getReviewSummary = function () {
  const totalReviews = this.reviews.length;
  if (totalReviews === 0) {
    return { total: 0, average: 0, distribution: {} };
  }

  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  this.reviews.forEach((review) => {
    distribution[review.rating] = (distribution[review.rating] || 0) + 1;
  });

  return {
    total: totalReviews,
    average: this.ratings,
    distribution,
  };
};

export default mongoose.model("Product", productSchema);
