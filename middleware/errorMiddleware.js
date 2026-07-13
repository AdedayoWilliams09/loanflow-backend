// FILE: backend/middleware/errorMiddleware.js


/**
 * Global Error Handler Middleware
 * 
 *  Child Explanation:
 * "This is like our emergency plan. If something goes wrong in the kitchen,
 * we have a special person who knows exactly what to do - they clean up the mess
 * and tell the customer what happened in a nice way."
 * 
 *  Technical Explanation:
 * "This middleware catches all errors thrown in the application and formats
 * them into a standardized JSON response. It hides stack traces in production
 * for security reasons."
 */
export const errorHandler = (err, req, res, next) => {
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log the error for debugging (development only)
  if (process.env.NODE_ENV === 'development') {
    console.error(' Error Details:');
    console.error('  Status Code:', statusCode);
    console.error('  Message:', message);
    console.error('  Stack Trace:', err.stack);
    console.error('  Request URL:', req.originalUrl);
    console.error('  Request Method:', req.method);
  } else {
    // Production: Log minimal error info
    console.error(` ${statusCode} - ${message} - ${req.originalUrl}`);
  }
  
  // Format the error response
  const errorResponse = {
    success: false,
    message: message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };
  
  // Add validation errors if they exist (from express-validator)
  if (err.errors && Array.isArray(err.errors)) {
    errorResponse.errors = err.errors.map(e => ({
      field: e.param,
      message: e.msg,
    }));
  }
  
  // Only include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  // Send the error response
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found Handler
 * 
 *  Child Explanation:
 * "This is like when someone asks for a room that doesn't exist in our hotel.
 * We politely tell them we don't have that room and suggest they ask for
 * something else."
 * 
 *  Technical Explanation:
 * "This middleware catches all requests that don't match any defined route
 * and returns a 404 Not Found response."
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Custom Error Class for Application Errors
 * 
 *  Child Explanation:
 * "This is a special way to tell our kitchen about problems. Instead of just
 * saying 'something went wrong', we can say 'the kitchen is out of eggs'."
 * 
 *  Technical Explanation:
 * "This extends the native Error class to add a statusCode property,
 * allowing us to create custom errors with specific HTTP status codes."
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates this is an expected error
    Error.captureStackTrace(this, this.constructor);
  }
}