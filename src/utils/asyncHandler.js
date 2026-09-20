// asyncHandler: wraps an async Express handler so rejected promises are
// automatically forwarded to the next() callback (and therefore to the
// global error handler) instead of crashing or requiring try/catch.

/**
 * Wrap an async route/controller function.
 * @param {Function} fn async function with a (req, res, next) signature
 * @returns {Function} express middleware
 */
module.exports = function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};