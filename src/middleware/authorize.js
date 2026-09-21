

const AppError = require("../utils/AppError");


module.exports = function authorize(...allowedRoles) {
  return function (req, _res, next) {
    if (!req.user) {
      return next(new AppError("Not authenticated. Please log in.", 401));
    }

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