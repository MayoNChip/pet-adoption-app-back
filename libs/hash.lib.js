const bcrypt = require("bcrypt");
require("dotenv").config();
const saltRounds = 10;

const hash = (value) => {
  return bcrypt.hashSync(value, saltRounds);
};

const checkHash = (value, hashed) => {
  return bcrypt.compareSync(value, hashed);
};

module.exports = {
  hash,
  checkHash,
};
