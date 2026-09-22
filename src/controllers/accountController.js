const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const userStore = require("../data/users");
const { findUserById, setUserPin, deposit } = userStore;

const BCRYPT_SALT_ROUNDS = 10;


exports.getBalance = asyncHandler(async (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Balance retrieved successfully.",
    data: {
      name: user.name,
      email: user.email,
      accountNumber: user.accountNumber,
      balance: user.balance,
    },
  });
});


exports.deposit = asyncHandler(async (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const { amount } = req.validatedBody;
  deposit(user.id, amount);

  res.status(200).json({
    success: true,
    message: "Deposit successful.",
    data: {
      name: user.name,
      email: user.email,
      accountNumber: user.accountNumber,
      newBalance: user.balance,
    },
  });
});


exports.createPin = asyncHandler(async (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    throw new AppError("User not found.", 404);
  }
  if (user.pin) {
    throw new AppError("Pin already exists. Use update pin instead.", 400);
  }

  const hashedPin = await bcrypt.hash(req.validatedBody.pin, BCRYPT_SALT_ROUNDS);
  setUserPin(user.id, hashedPin);

  res.status(201).json({
    success: true,
    message: "Pin created successfully.",
    data: null,
  });
});


exports.updatePin = asyncHandler(async (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    throw new AppError("User not found.", 404);
  }
  if (!user.pin) {
    throw new AppError("No pin exists. Create a pin first.", 400);
  }

  const { currentPin, newPin } = req.validatedBody;
  const pinMatches = await bcrypt.compare(currentPin, user.pin);
  if (!pinMatches) {
    throw new AppError("Current pin is incorrect.", 400);
  }

  const hashedPin = await bcrypt.hash(newPin, BCRYPT_SALT_ROUNDS);
  setUserPin(user.id, hashedPin);

  res.status(200).json({
    success: true,
    message: "Pin updated successfully.",
    data: null,
  });
});