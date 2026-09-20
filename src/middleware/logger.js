// logger: simple request logger.
// Logs "METHOD url - statusCode - time" after the response finishes.
// NEVER logs bodies, passwords, headers or tokens.

/**
 * Express middleware that logs finished responses.
 * Example output: "POST /api/auth/login - 200 - 19:32:10"
 */
module.exports = function logger(req, res, next) {
  // Register a listener for the "finish" event, which fires once the
  // response has been fully sent to the client.
  res.on("finish", () => {
    const time = new Date().toLocaleTimeString();
    // Only the method, URL and status are logged - nothing sensitive.
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${time}`);
  });

  next();
};