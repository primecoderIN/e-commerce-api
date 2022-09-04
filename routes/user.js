const express = require("express");
const router = express.Router();

const { signup ,login} = require("../controllers/userController.js");

router.route("/signup").post(signup);
router.route("/login").post(login);

module.exports = router;
