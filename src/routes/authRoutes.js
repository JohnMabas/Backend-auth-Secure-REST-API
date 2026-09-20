// authRoutes: public authentication endpoints.
// The stricter authLimiter is applied here to deter brute-force attempts.

const express = require("express");
const validate = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimiter");
const { validateRegister, validateLogin } = require("../validators/authValidator");
const authController = require("../controllers/authController");

const router = express.Router();

// A global router-level limiter for every route registered in this file.
router.use(authLimiter);

// Register: validate -> controller
router.post("/register", validate(validateRegister), authController.register);

// Login: validate -> controller
router.post("/login", validate(validateLogin), authController.login);

module.exports = router;