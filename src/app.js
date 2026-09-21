
const express = require("express");
const helmet = require("helmet");
const AppError = require("./utils/AppError");
const logger = require("./middleware/logger");
const { generalLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(helmet());

app.use(express.json({ limit: "10kb" }));

app.use(logger);

app.use(generalLimiter);


app.get("/", (req, res) => {
  res.json({ success: true, message: "API is running.", data: null });
});

app.use("/api/auth", authRoutes); 
app.use("/api/products", productRoutes);

app.use((req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;