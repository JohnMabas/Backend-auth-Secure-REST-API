// app.js: wires up express with security, parsing, logging, rate limiting,
// routes and error handling, all in the documented middleware order:
//   helmet -> express.json -> logger -> general rate limiter ->
//   routes (authLimiter on auth routes) -> notFound -> global errorHandler.

const express = require("express");
const helmet = require("helmet");
const AppError = require("./utils/AppError");
const logger = require("./middleware/logger");
const { generalLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// 1. Security headers.
app.use(helmet());

// 2. Parse JSON with a small body size limit (rejects oversized payloads).
app.use(express.json({ limit: "10kb" }));

// 3. Request logging (method, url, status, time).
app.use(logger);

// 4. General rate limiter for the whole API (100 req / 15 min / IP).
app.use(generalLimiter);

// 5. Routes.
//    Health check so users can confirm the server is alive without auth.
app.get("/", (req, res) => {
  res.json({ success: true, message: "API is running.", data: null });
});

app.use("/api/auth", authRoutes); // authLimiter => 10 req / 15 min
app.use("/api/products", productRoutes);

// 6. 404 for any unknown route -> forwarded to the central error handler.
app.use((req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
});

// 7. Central error handler (must be last).
app.use(errorHandler);

module.exports = app;