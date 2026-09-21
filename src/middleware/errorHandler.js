
module.exports = function errorHandler(error, req, res, _next) {
  const statusCode = error.statusCode && error.statusCode >= 400 && error.statusCode <= 599
    ? error.statusCode
    : 500;

  const isOperational = error.isOperational === true;

  if (!isOperational || statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`, error);
  }

  const message =
    !isOperational || statusCode >= 500 ? "Something went wrong." : error.message;

  res.status(statusCode).json({
    success: false,
    message,
  });
};