import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { delete_file, upload_file } from "../utils/cloudinary.js";

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Register user   =>  /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return next(
      new ErrorHandler("Please provide name, email and password", 400),
    );
  }

  // Validate email format
  if (!validateEmail(email)) {
    return next(new ErrorHandler("Please provide a valid email address", 400));
  }

  // Validate password strength
  if (!validatePassword(password)) {
    return next(
      new ErrorHandler(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
        400,
      ),
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return next(new ErrorHandler("User already exists with this email", 400));
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
  });

  // Log registration
  console.log(`User registered: ${user.email} (${user._id})`);

  sendToken(user, 201, res);
});

// Login user   =>  /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  // Find user in the database
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  // Use consistent error message for security
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  // Log login event
  console.log(`User logged in: ${user.email} (${user._id})`);

  sendToken(user, 200, res);
});

// Logout user   =>  /api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Upload user avatar   =>  /api/v1/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.avatar) {
    return next(new ErrorHandler("Please provide an avatar image", 400));
  }

  const avatarResponse = await upload_file(req.body.avatar, "shopit/avatars");

  // Remove previous avatar if exists
  if (req?.user?.avatar?.public_id) {
    await delete_file(req?.user?.avatar?.public_id);
  }

  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    { avatar: avatarResponse },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    user,
  });
});

// Forgot password   =>  /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email || !validateEmail(email)) {
    return next(new ErrorHandler("Please provide a valid email address", 400));
  }

  // Find user in the database
  const user = await User.findOne({ email: email.toLowerCase() });

  // Don't reveal if user exists or not for security
  if (!user) {
    return res.status(200).json({
      success: true,
      message: `If an account exists with ${email}, you will receive a password reset email`,
    });
  }

  // Get reset password token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = getResetPasswordTemplate(user?.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIT Password Recovery",
      message,
    });

    // Log password reset request
    console.log(`Password reset email sent to: ${user.email}`);

    res.status(200).json({
      success: true,
      message: `Password reset email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    console.error(`Password reset email failed for ${user.email}:`, error);
    return next(
      new ErrorHandler(
        "Failed to send password reset email. Please try again later.",
        500,
      ),
    );
  }
});

// Reset password   =>  /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Validate inputs
  if (!password || !confirmPassword) {
    return next(
      new ErrorHandler("Please provide password and confirm password", 400),
    );
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  // Validate password strength
  if (!validatePassword(password)) {
    return next(
      new ErrorHandler(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
        400,
      ),
    );
  }

  // Hash the URL Token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has expired. Please request a new reset link.",
        400,
      ),
    );
  }

  // Set the new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // Log password reset
  console.log(`Password reset successful for: ${user.email}`);

  sendToken(user, 200, res);
});

// Get current user profile  =>  /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update Password  =>  /api/v1/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, password } = req.body;

  if (!oldPassword || !password) {
    return next(
      new ErrorHandler("Please provide current and new password", 400),
    );
  }

  // Validate new password strength
  if (!validatePassword(password)) {
    return next(
      new ErrorHandler(
        "New password must be at least 8 characters with uppercase, lowercase, number, and special character",
        400,
      ),
    );
  }

  const user = await User.findById(req?.user?._id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check the previous user password
  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect", 400));
  }

  user.password = password;
  await user.save();

  // Log password update
  console.log(`Password updated for: ${user.email}`);

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// Update User Profile  =>  /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return next(
      new ErrorHandler("Please provide at least one field to update", 400),
    );
  }

  const updateData = {};

  if (name) {
    updateData.name = name.trim();
  }

  if (email) {
    if (!validateEmail(email)) {
      return next(
        new ErrorHandler("Please provide a valid email address", 400),
      );
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      return next(new ErrorHandler("Email already in use", 400));
    }

    updateData.email = email.toLowerCase();
  }

  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Get all Users - ADMIN  =>  /api/v1/admin/users
export const allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find().select(
    "-password -resetPasswordToken -resetPasswordExpire",
  );

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// Get User Details - ADMIN  =>  /api/v1/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    "-password -resetPasswordToken -resetPasswordExpire",
  );

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Details - ADMIN  =>  /api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, role } = req.body;

  if (!name && !email && !role) {
    return next(
      new ErrorHandler("Please provide at least one field to update", 400),
    );
  }

  const updateData = {};

  if (name) updateData.name = name.trim();
  if (email) {
    if (!validateEmail(email)) {
      return next(
        new ErrorHandler("Please provide a valid email address", 400),
      );
    }
    updateData.email = email.toLowerCase();
  }
  if (role) {
    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return next(
        new ErrorHandler("Invalid role. Must be 'user' or 'admin'", 400),
      );
    }
    updateData.role = role;
  }

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password -resetPasswordToken -resetPasswordExpire");

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404),
    );
  }

  // Log admin action
  console.log(`User updated by admin: ${user.email} (${user._id})`);

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete User - ADMIN  =>  /api/v1/admin/users/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404),
    );
  }

  // Prevent admin from deleting their own account
  if (user._id.toString() === req.user._id.toString()) {
    return next(new ErrorHandler("Cannot delete your own account", 400));
  }

  // Remove user avatar from cloudinary
  if (user?.avatar?.public_id) {
    await delete_file(user?.avatar?.public_id);
  }

  await user.deleteOne();

  // Log admin action
  console.log(`User deleted by admin: ${user.email} (${user._id})`);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
