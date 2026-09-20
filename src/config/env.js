// Loads and validates environment variables.
// Guards the app: if the mandatory JWT_SECRET is missing we exit (loudly)
// instead of silently running an insecure server.

const dotenv = require("dotenv");
const path = require("path");

// Load .env from the project root into process.env.
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

// Required secrets. If missing, crash BEFORE the server starts.
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
  // jwtwebtoken-friendly expiry string, default "1h".
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  nodeEnv: process.env.NODE_ENV || "development",
};