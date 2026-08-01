import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      maxLength: [50, "Your name cannot exceed 50 characters"],
      minLength: [2, "Your name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [8, "Your password must be at least 8 characters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    role: {
      type: String,
      default: "user",
      enum: {
        values: ["user", "admin", "moderator"],
        message: "Please select a valid role",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastPasswordReset: Date,
    passwordChangedAt: Date,
    lastLogin: Date,
    loginHistory: [
      {
        ip: String,
        userAgent: String,
        loginAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    preferences: {
      language: {
        type: String,
        default: "en",
      },
      currency: {
        type: String,
        default: "USD",
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: false,
        },
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Password complexity validation
userSchema.pre("validate", function (next) {
  if (this.isModified("password")) {
    const password = this.password;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      this.invalidate(
        "password",
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      );
    }
  }
  next();
});

// Encrypting password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Hash password
    this.password = await bcrypt.hash(this.password, 12);

    // Update password changed timestamp
    this.passwordChangedAt = new Date();

    // Clear any reset tokens when password is changed
    this.resetPasswordToken = undefined;
    this.resetPasswordExpire = undefined;

    next();
  } catch (error) {
    next(error);
  }
});

// Return JWT Token
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_TIME || "7d",
    },
  );
};

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expire time - 30 minutes
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  this.lastPasswordReset = new Date();

  return resetToken;
};

// Generate email verification token
userSchema.methods.getEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Update last login
userSchema.methods.updateLastLogin = function (ip, userAgent) {
  this.lastLogin = new Date();

  // Keep only last 10 login records
  this.loginHistory.push({ ip, userAgent });
  if (this.loginHistory.length > 10) {
    this.loginHistory = this.loginHistory.slice(-10);
  }

  return this.save();
};

// Deactivate account
userSchema.methods.deactivate = async function () {
  this.isActive = false;
  return this.save();
};

// Activate account
userSchema.methods.activate = async function () {
  this.isActive = true;
  return this.save();
};

// Virtual field: Full name (if you want to split first/last names later)
userSchema.virtual("displayName").get(function () {
  return this.name;
});

// Static method to find active users
userSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

// Static method to get user by email (case-insensitive)
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

export default mongoose.model("User", userSchema);
