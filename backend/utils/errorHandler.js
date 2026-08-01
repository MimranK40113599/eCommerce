// Error types
export const ErrorTypes = {
  VALIDATION: "VALIDATION_ERROR",
  AUTHENTICATION: "AUTHENTICATION_ERROR",
  AUTHORIZATION: "AUTHORIZATION_ERROR",
  NOT_FOUND: "NOT_FOUND_ERROR",
  DUPLICATE: "DUPLICATE_ERROR",
  DATABASE: "DATABASE_ERROR",
  EXTERNAL: "EXTERNAL_SERVICE_ERROR",
  RATE_LIMIT: "RATE_LIMIT_ERROR",
  PAYMENT: "PAYMENT_ERROR",
  BUSINESS: "BUSINESS_LOGIC_ERROR",
};

class ErrorHandler extends Error {
  constructor(message, statusCode, errorType = null, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType || this._getErrorType(statusCode);
    this.code = code;
    this.isOperational = true;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Determine error type based on status code
   */
  _getErrorType(statusCode) {
    switch (statusCode) {
      case 400:
        return ErrorTypes.VALIDATION;
      case 401:
        return ErrorTypes.AUTHENTICATION;
      case 403:
        return ErrorTypes.AUTHORIZATION;
      case 404:
        return ErrorTypes.NOT_FOUND;
      case 409:
        return ErrorTypes.DUPLICATE;
      case 429:
        return ErrorTypes.RATE_LIMIT;
      case 500:
      case 502:
      case 503:
      case 504:
        return ErrorTypes.DATABASE;
      default:
        return "UNKNOWN_ERROR";
    }
  }

  /**
   * Convert to JSON for response
   */
  toJSON() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      errorType: this.errorType,
      code: this.code,
      ...(process.env.NODE_ENV === "DEVELOPMENT" && {
        stack: this.stack,
      }),
    };
  }

  /**
   * Static factory methods for common errors
   */
  static validation(message) {
    return new ErrorHandler(message, 400, ErrorTypes.VALIDATION);
  }

  static authentication(message = "Authentication required") {
    return new ErrorHandler(message, 401, ErrorTypes.AUTHENTICATION);
  }

  static authorization(message = "Not authorized to access this resource") {
    return new ErrorHandler(message, 403, ErrorTypes.AUTHORIZATION);
  }

  static notFound(resource = "Resource") {
    return new ErrorHandler(`${resource} not found`, 404, ErrorTypes.NOT_FOUND);
  }

  static duplicate(field, value) {
    return new ErrorHandler(
      `${field} "${value}" already exists`,
      409,
      ErrorTypes.DUPLICATE,
      "DUPLICATE_ENTRY",
    );
  }

  static database(message = "Database operation failed") {
    return new ErrorHandler(message, 500, ErrorTypes.DATABASE);
  }

  static external(service, message = "External service error") {
    return new ErrorHandler(`${service}: ${message}`, 502, ErrorTypes.EXTERNAL);
  }

  static payment(message = "Payment processing failed") {
    return new ErrorHandler(message, 402, ErrorTypes.PAYMENT);
  }

  static rateLimit(message = "Too many requests") {
    return new ErrorHandler(message, 429, ErrorTypes.RATE_LIMIT);
  }

  static business(message) {
    return new ErrorHandler(message, 422, ErrorTypes.BUSINESS);
  }
}

export default ErrorHandler;
