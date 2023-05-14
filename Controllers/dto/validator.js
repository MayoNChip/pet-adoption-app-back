const ErrorHandler = require("../../libs/errorHandling.lib");
const ajv = require("./ajv");

const validateReq = (schema) => {
  return (req, res, next) => {
    const validator = ajv.compile(schema);

    const valid = validator(req.body);

    if (!valid) {
      return next({ status: 400, msg: validator.errors[0].message });
    }
    next();
  };
};

module.exports = validateReq;
