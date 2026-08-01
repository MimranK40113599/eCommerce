/**
 * Wraps async controller functions to catch errors and pass them to Express error handler
 * @param {Function} controllerFunction - Async express middleware function
 * @returns {Function} - Express middleware function with error handling
 */
export default (controllerFunction) => async (req, res, next) => {
  try {
    await controllerFunction(req, res, next);
  } catch (error) {
    // Add request context to error for debugging
    error.reqContext = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userId: req.user?._id,
      body: process.env.NODE_ENV === "DEVELOPMENT" ? req.body : undefined,
    };

    // Log error with context
    console.error(`Error in ${controllerFunction.name || "anonymous"}:`, {
      message: error.message,
      stack: error.stack,
      context: error.reqContext,
    });

    // Pass error to Express error handler
    next(error);
  }
};
