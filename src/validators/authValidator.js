const AppError = require("../utils/AppError");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN = 2;
const NAME_MAX = 50;
const PASSWORD_MIN = 6;
const PIN_PATTERN = /^\d{4}$/;

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

  return { name: trimmedName, email: normalizedEmail, password };
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


function validateCreatePin(body) {
  const pin = requireStringField(body, "pin", "pin");
  if (!PIN_PATTERN.test(pin)) {
    throw new AppError("pin must be a 4-digit number.", 400);
  }
  return { pin };
}


function validateUpdatePin(body) {
  const currentPin = requireStringField(body, "currentPin", "currentPin");
  const newPin = requireStringField(body, "newPin", "newPin");
  if (!PIN_PATTERN.test(currentPin)) {
    throw new AppError("currentPin must be a 4-digit number.", 400);
  }
  if (!PIN_PATTERN.test(newPin)) {
    throw new AppError("newPin must be a 4-digit number.", 400);
  }
  return { currentPin, newPin };
}


function validateDeposit(body) {
  const amount = body.amount;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new AppError("amount must be a positive number.", 400);
  }
  return { amount };
}


function validateTransfer(body) {
  const recipientEmail = requireStringField(body, "recipientEmail", "recipientEmail");
  const pin = requireStringField(body, "pin", "pin");
  const amount = body.amount;

  const normalizedEmail = recipientEmail.trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw new AppError("recipientEmail must be a valid email address.", 400);
  }

  if (!PIN_PATTERN.test(pin)) {
    throw new AppError("pin must be a 4-digit number.", 400);
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new AppError("amount must be a positive number.", 400);
  }

  return { recipientEmail: normalizedEmail, pin, amount };
}

module.exports = {
  validateRegister,
  validateLogin,
  validateCreatePin,
  validateUpdatePin,
  validateDeposit,
  validateTransfer,
};