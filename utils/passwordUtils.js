const bcrypt = require("bcrypt");

function hashPassword(password) {
  return bcrypt.genSalt(10).then((salt) => bcrypt.hash(password, salt));
}

function comparePassword(password, hashPassword) {
  return bcrypt.compare(password, hashPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
};
