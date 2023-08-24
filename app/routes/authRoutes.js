const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");
const {
  userSignupValidator,
  validate,
  userLoginValidator,
} = require("../validations/userValidation");

//GET Requests
router.get("/logout", authController.logout_get);

//POST Requests
router.post(
  "/signup",
  userSignupValidator(),
  validate,
  authController.signup_post
);
router.post(
  "/login",
  userLoginValidator(),
  validate,
  authController.login_post
);

module.exports = router;
