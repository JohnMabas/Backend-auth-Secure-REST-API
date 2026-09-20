// AppError: a custom error class that carries an HTTP status code.
//
// WHY: a plain `new Error()` has no status code. By throwing AppError with a
// statusCode the global error handler can return the correct HTTP status and
// a clean JSON response without any try/catch in controllers.

class AppError extends Error {
  /**
   * @param {string} message human-readable message for the client
   * @param {number} statusCode HTTP status code (400, 401, 403, 404, 409...)
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // "success" is a reserved-ish name; use "isOperational" to mark errors we
    // intentionally created so the handler can distinguish them from bugs.
    this.isOperational = true;
    // Exclude this constructor call from the stack trace so logs stay clean.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;