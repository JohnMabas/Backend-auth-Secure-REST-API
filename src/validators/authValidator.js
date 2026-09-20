// authValidator: validates and sanitizes the auth request bodies.
// Every rule returns a SPECIFIC message so callers know exactly what to fix.
// Non-string values are rejected to protect against object/array injection.

const AppError = require("../utils/AppError");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN = 2;
const NAME_MAX = 50;
const PASSWORD_MIN = 6;
const ALLOWED_ROLES = ["user", "admin"];

// Helpers that reject a field when it is missing or not a plain string.
function requireStringField(body, field, label) {
  const value = body[field];
  if (value === undefined || value === null || typeof value !== "string") {
    throw new AppError(`${label} must be a string.`, 400);
  }
  return value;
}

/**
 * Validate registration payload { name, email, password, role }.
 * Returns a sanitized object with only the allowed fields.
 */
function validateRegister(body) {
  const name = requireStringField(body, "name", "name");
  const email = requireStringField(body, "email", "email");
  const password = requireStringField(body, "password", "password");
  const role = requireStringField(body, "role", "role");

  // --- name: trimmed, 2 to 50 characters ---
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    throw new AppError("name cannot be empty.", 400);
  }
  if (trimmedName.length < NAME_MIN || trimmedName.length > NAME_MAX) {
    throw new AppError(`name must be between ${NAME_MIN} and ${NAME_MAX} characters.`, 400);
  }

  // --- email: valid format, trimmed and lowercased ---
  const normalizedEmail = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw new AppError("email must be a valid email address.", 400);
  }

  // --- password: length + strength rules with a specific message each ---
  if (password.length < PASSWORD_MIN) {
    throw new AppError(`password must be at least ${PASSWORD_MIN} characters long.`, 400);
  }
  if (!/[a-z]/.test(password)) {
    throw new AppError("password must contain at least one lowercase letter.", 400);
  }
  if (!/[A-Z]/.test(password)) {
    throw new AppError("password must contain at least one uppercase letter.", 400);
  }
  if (!/\d/.test(password)) {
    throw new AppError("password must contain at least one number.", 400);
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new AppError("password must contain at least one special character.", 400);
  }

  // --- role: exactly "user" or "admin" ---
  if (!ALLOWED_ROLES.includes(role)) {
    throw new AppError(`role must be one of: ${ALLOWED_ROLES.join(", ")}.`, 400);
  }

  // Return ONLY the allowed fields, sanitized.
  return { name: trimmedName, email: normalizedEmail, password, role };
}

/**
 * Validate login payload { email, password }.
 * Returns a sanitized object, or throws a 400 for missing/non-string fields.
 */
function validateLogin(body) {
  const email = requireStringField(body, "email", "email");
  const password = requireStringField(body, "password", "password");

  const normalizedEmail = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw new AppError("email must be a valid email address.", 400);
  }

  return { email: normalizedEmail, password };
}

module.exports = {
  validateRegister,
  validateLogin,
};