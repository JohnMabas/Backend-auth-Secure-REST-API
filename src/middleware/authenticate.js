

const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { jwtSecret } = require("../config/env");


module.exports = function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
      return next(new AppError("Not authenticated. Provide a valid Bearer token.", 401));
    }

    const token = header.split(" ")[1];

    if (!token) {
      return next(new AppError("Not authenticated. Provide a valid Bearer token.", 401));
    }

   
    const decoded = jwt.verify(token, jwtSecret);

   
    req.user = { id: decoded.id, email: decoded.email };
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired. Please log in again.", 401));
    }
    return next(new AppError("Invalid token.", 401));
  }
};