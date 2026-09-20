// authenticate: verifies the "Authorization: Bearer <token>" header and
// attaches the decoded payload to req.user.

const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { jwtSecret } = require("../config/env");

/**
 * Express middleware: authenticate a request via its bearer token.
 * Success: req.user = { id, email, role }
 * Failure: 401 with a clear message (never reveals token internals).
 */
module.exports = function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || "";

    // Header must be present and look like "Bearer <token>".
    if (!header.startsWith("Bearer ")) {
      return next(new AppError("Not authenticated. Provide a valid Bearer token.", 401));
    }

    const token = header.split(" ")[1];

    // Guard against the "Bearer " prefix with no token after it.
    if (!token) {
      return next(new AppError("Not authenticated. Provide a valid Bearer token.", 401));
    }

    // jwt.verify throws TokenExpiredError for expired tokens and
    // JsonWebTokenError for anything else (bad secret, malformed token...).
    const decoded = jwt.verify(token, jwtSecret);

    // Attach the identity to the request so downstream middleware (authorize)
    // and controllers can use req.user without verifying again.
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired. Please log in again.", 401));
    }
    return next(new AppError("Invalid token.", 401));
  }
};