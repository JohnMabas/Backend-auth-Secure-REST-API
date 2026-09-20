// rateLimiter: protects the API from abuse.
//  - `generalLimiter` is applied to every route (100 req / 15 min).
//  - `authLimiter` is stricter and applied to login/register (10 req / 15 min).

const rateLimit = require("express-rate-limit");

// General limiter for the whole API.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  standardHeaders: true, // return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // disable the deprecated `X-RateLimit-*` headers
  // Respond with the standard JSON shape instead of the default text body.
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
});

// Stricter limiter for the auth endpoints (login + register) since they are
// common brute-force targets.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 auth attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many attempts. Please try again later.",
    });
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
};