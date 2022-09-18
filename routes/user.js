const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getLoggedInUserDetails,
  updateUserPassword,
  updateUserDetails,
} = require("../controllers/userController.js");
const { AuthenticateUser } = require("../middlewares/AuthenticateUser");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/user/dashboard").get(AuthenticateUser, getLoggedInUserDetails);
router
  .route("/user/update/password")
  .post(AuthenticateUser, updateUserPassword);
router.route("/user/update").put(AuthenticateUser, updateUserDetails);

module.exports = router;
