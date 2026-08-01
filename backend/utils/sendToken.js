/**
 * Create token and save in the cookie
 */
export default (user, statusCode, res) => {
  // Validate user
  if (!user || !user._id) {
    throw new Error("Invalid user object provided for token generation");
  }

  // Create JWT Token
  let token;
  try {
    token = user.getJwtToken();
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }

  // Validate token
  if (!token) {
    throw new Error("Failed to generate JWT token");
  }

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.COOKIE_EXPIRES_TIME) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  };

  // Add secure flag in production
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
    options.domain = process.env.COOKIE_DOMAIN || undefined;
  }

  // Add path if specified
  if (process.env.COOKIE_PATH) {
    options.path = process.env.COOKIE_PATH;
  }

  // Log token generation (for audit purposes)
  console.log(
    `Token generated for user: ${user.email || user._id} (${user._id})`,
  );

  // Send response with cookie
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
};
