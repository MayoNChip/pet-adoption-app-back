const ErrorHandler = require("../libs/errorHandling.lib");
const hashLib = require("../libs/hash.lib");
const jwtLib = require("../libs/jwt.lib");

const validateLogin = (password, hashed) => {
  return hashLib.checkHash(password, hashed);
};

const generateHash = (password) => {
  const hashedPassword = hashLib.hash(password);
  return hashedPassword;
};

const generateAccessToken = (userId) => {
  return jwtLib.generateAccessToken(userId);
};

module.exports = {
  generateHash,
  validateLogin,
  generateAccessToken,
};
