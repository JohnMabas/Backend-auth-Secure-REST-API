// authorize: role-based access control (RBAC).
// Factory that returns a middleware enforcing that req.user.role is allowed.

const AppError = require("../utils/AppError");

/**
 * Build an authorization middleware restricted to the given roles.
 * @param {...string} allowedRoles roles allowed to continue (e.g. "admin")
 * @returns {Function} express middleware
 */
module.exports = function authorize(...allowedRoles) {
  return function (req, _res, next) {
    // authenticate must run BEFORE authorize so req.user is populated.
    if (!req.user) {
      return next(new AppError("Not authenticated. Please log in.", 401));
    }

    // Check whether the request's role is in the allowed list.
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Forbidden. You need one of these roles: ${allowedRoles.join(", ")}.`,
          403
        )
      );
    }

    return next();
  };
};