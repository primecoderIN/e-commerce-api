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
  adminAllUsers,
  managerAllUsers,
  adminGetOneUser,
  adminDeleteOneUser,
} = require("../controllers/userController.js");
const { AuthenticateUser } = require("../middlewares/AuthenticateUser");
const { AccessRoles} = require("../middlewares/AccessRoles");

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
//Admins can access all users including himself
router.route("/admin/users").get(AuthenticateUser,AccessRoles("admin"), adminAllUsers);
//Managers can access all users
router
  .route("/manager/users")
  .get(AuthenticateUser, AccessRoles("manager"), managerAllUsers);
  router
    .route("/admin/user/:id")
    .get(AuthenticateUser, AccessRoles("admin"), adminGetOneUser)
    .delete(AuthenticateUser, AccessRoles("admin"), adminDeleteOneUser)


module.exports = router;
