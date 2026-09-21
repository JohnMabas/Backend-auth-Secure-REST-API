
module.exports = function validate(validatorFn) {
  return function (req, _res, next) {
    try {
    
      req.validatedBody = validatorFn(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};