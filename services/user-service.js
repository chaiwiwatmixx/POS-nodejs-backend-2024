const User = require("../models/userModel");

const checkUserExiste = (email, phone) => {
  return User.findOne({ email, phone });
};

module.exports = {
  checkUserExiste,
};
