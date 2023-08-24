const User = require("../models/User");
const { createToken } = require("../services/authService");
const { translateError } = require("../services/mongo_helper");
const { encryptPassword } = require("../services/userService");

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = new User({
      email,
      password: await encryptPassword(password),
    });

    const token = createToken(user._id);
    const maxAge = 3 * 24 * 60 * 60;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: maxAge * 1000,
    });
    if (await user.save()) {
      const { password, ...userData } = user.toObject();
      res.status(201).json({ success: true, data: userData });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: translateError(error),
    });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id, user.role);
    const maxAge = 3 * 24 * 60 * 60;
    res.cookie("token", token, {
      httpOnly: true,
      // domain: 'example.com',
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ success: true, data: user, token });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: translateError(error),
    });
  }
};

module.exports.logout_get = async (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.status(200).json({ success: true, message: "Logout Successful" });
};
