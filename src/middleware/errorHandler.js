// errorHandler: central error middleware.
//  - operational errors (AppError) -> their own status code and message.
//  - unknown errors (bugs) -> 500 "Something went wrong", real error logged
//    ONLY on the server. Stack traces and internals are never exposed.

/**
 * Express error-handling middleware. Signature REQUIRES 4 params so Express
 * recognizes it as an error handler (not a regular middleware).
 */
module.exports = function errorHandler(error, req, res, _next) {
  // Default to a generic 500.
  const statusCode = error.statusCode && error.statusCode >= 400 && error.statusCode <= 599
    ? error.statusCode
    : 500;

  // Distinguish our intentional AppErrors from bugs / unknown failures.
  const isOperational = error.isOperational === true;

  if (!isOperational || statusCode >= 500) {
    // Log the real error for the developer, NEVER send it to the client.
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`, error);
  }

  // Never expose stack traces (only the message is sent, and only safe ones).
  const message =
    !isOperational || statusCode >= 500 ? "Something went wrong." : error.message;

  res.status(statusCode).json({
    success: false,
    message,
  });
};