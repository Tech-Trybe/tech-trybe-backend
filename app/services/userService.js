const User = require("../models/User");
const bcrypt = require("bcrypt");

//Get User By Email
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });

  if (user !== null) {
    return [true, user];
  } else {
    return [false, "User with that email doesn't exist"];
  }
};
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(13);
  return await bcrypt.hash(password, salt);
};

module.exports = { getUserByEmail, encryptPassword };
