
const AppError = require("../utils/AppError");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN = 2;
const NAME_MAX = 50;
const PASSWORD_MIN = 6;
const ALLOWED_ROLES = ["user", "admin"];

function requireStringField(body, field, label) {
  const value = body[field];
  if (value === undefined || value === null || typeof value !== "string") {
    throw new AppError(`${label} must be a string.`, 400);
  }
  return value;
}


function validateRegister(body) {
  const name = requireStringField(body, "name", "name");
  const email = requireStringField(body, "email", "email");
  const password = requireStringField(body, "password", "password");
  const role = requireStringField(body, "role", "role");

  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    throw new AppError("name cannot be empty.", 400);
  }
  if (trimmedName.length < NAME_MIN || trimmedName.length > NAME_MAX) {
    throw new AppError(`name must be between ${NAME_MIN} and ${NAME_MAX} characters.`, 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw new AppError("email must be a valid email address.", 400);
  }

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

  if (!ALLOWED_ROLES.includes(role)) {
    throw new AppError(`role must be one of: ${ALLOWED_ROLES.join(", ")}.`, 400);
  }

  return { name: trimmedName, email: normalizedEmail, password, role };
}


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