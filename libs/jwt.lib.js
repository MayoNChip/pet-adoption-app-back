const jwt = require("jsonwebtoken");
const secret = "123456";

const generateAccessToken = (userId) => {
  const second = Math.floor(Date.now() / 1000);
  const week = second + 60 * 60 * 24 * 7;
  const ACCESS_TOKEN = jwt.sign({ userId, exp: week }, secret);
  return ACCESS_TOKEN;
};

module.exports = { generateAccessToken };
