const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res
          .status(401)
          .json({ success: true, message: { error: "Invalid Token" } });
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.status(401).json({
      success: true,
      message: { error: "No Valid Token Please Login" },
    });
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res
          .status(401)
          .json({ success: true, message: { error: "Invalid Token" } });

        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res;
        next();
      }
    });
  } else {
    res.status(401).json({
      success: true,
      message: { error: "No Valid Token Please Login" },
    });
  }
};

module.exports = { requireAuth, checkUser };
