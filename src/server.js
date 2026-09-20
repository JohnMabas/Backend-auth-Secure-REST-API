// server.js: entry point. Loads env config, starts the HTTP server and tells
// the developer which port + environment is in use.

const app = require("./app");
const { port, nodeEnv } = require("./config/env");

app.listen(port, () => {
  console.log(
    `Server running in ${nodeEnv} mode at http://localhost:${port}`
  );
});