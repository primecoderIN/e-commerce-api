const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getLoggedInUserDetails,
  updateUserPassword
} = require("../controllers/userController.js");
const { AuthenticateUser } = require("../middlewares/AuthenticateUser");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/user/dashboard").get(AuthenticateUser, getLoggedInUserDetails);
router.route("/user/update/password").get(AuthenticateUser, updateUserPassword);

module.exports = router;
