
module.exports = function logger(req, res, next) {

  res.on("finish", () => {
    const time = new Date().toLocaleTimeString();
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${time}`);
  });

  next();
};