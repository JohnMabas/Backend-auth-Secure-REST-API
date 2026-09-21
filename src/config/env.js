
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

if (!process.env.JWT_SECRET) {
  console.error(
    "FATAL ERROR: JWT_SECRET is missing. " +
      "Create a .env file based on .env.example and set a strong JWT_SECRET."
  );
  process.exit(1);
}

module.exports = {
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  nodeEnv: process.env.NODE_ENV || "development",
};