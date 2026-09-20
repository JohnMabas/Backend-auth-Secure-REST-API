// validate: glue between the route, the validators and the error handler.
// Runs a validator function against req.body; any AppError thrown by the
// validator is forwarded to the global error handler, so controllers never
// see invalid input.

/**
 * Build an Express middleware that runs a validator for the request body.
 * @param {Function} validatorFn function(body) -> sanitized payload (throws AppError on failure)
 * @returns {Function} express middleware
 */
module.exports = function validate(validatorFn) {
  return function (req, _res, next) {
    try {
      // The validator returns a sanitized object containing ONLY the allowed
      // fields, which we attach to req.validatedBody for the controller.
      req.validatedBody = validatorFn(req.body);
      next();
    } catch (error) {
      // AppError (with a specific message) bubbles up untouched.
      next(error);
    }
  };
};