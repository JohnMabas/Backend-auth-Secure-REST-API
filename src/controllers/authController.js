// authController: handles register + login.
// Passwords are hashed with bcrypt and NEVER returned to the client.

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const userStore = require("../data/users");
const { jwtSecret, jwtExpiresIn } = require("../config/env");

const BCRYPT_SALT_ROUNDS = 10;

/**
 * Strip the password field so a user object is safe to send to the client.
 * @param {object} user the stored user (with hashed password)
 * @returns {object} a copy without the password field
 */
function toPublicUser(user) {
  const { password, ...publicUser } = user;
  return publicUser;
}

/**
 * POST /api/auth/register
 * Creates a new user with a hashed password.
 * Expects req.validatedBody = { name, email, password, role }.
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.validatedBody;

  // Email uniqueness -> 409 Conflict (duplicate record).
  if (userStore.findUserByEmail(email)) {
    throw new AppError("Email is already registered.", 409);
  }

  // Hash BEFORE storing: we never save plain-text passwords.
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const user = userStore.createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    data: toPublicUser(user), // no password!
  });
});

/**
 * POST /api/auth/login
 * Validates credentials and issues a JWT.
 * Expects req.validatedBody = { email, password }.
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedBody;

  const user = userStore.findUserByEmail(email);

  // IMPORTANT: use the SAME message whether the user does not exist OR the
  // password is wrong, so attackers cannot tell which one failed.
  const invalid = new AppError("Invalid credentials.", 401);

  // Utilities like bcrypt.compare return true/false, not throw, so no crash risk.
  if (!user) throw invalid;
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) throw invalid;

  // Sign a short-lived JWT containing only the identity fields.
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      token,
      user: toPublicUser(user),
    },
  });
});