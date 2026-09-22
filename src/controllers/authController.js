

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const userStore = require("../data/users");
const { jwtSecret, jwtExpiresIn } = require("../config/env");

const BCRYPT_SALT_ROUNDS = 10;


function toPublicUser(user) {
  const { password, ...publicUser } = user;
  return publicUser;
}


exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.validatedBody;

  if (userStore.findUserByEmail(email)) {
    throw new AppError("Email is already registered.", 409);
  }

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
    data: toPublicUser(user), 
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedBody;

  const user = userStore.findUserByEmail(email);


  const invalid = new AppError("Invalid credentials.", 401);

  if (!user) throw invalid;
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) throw invalid;

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