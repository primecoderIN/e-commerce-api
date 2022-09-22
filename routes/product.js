const express = require("express");
const router = express.Router();
const { AuthenticateUser } = require("../middlewares/AuthenticateUser");
const { AccessRoles } = require("../middlewares/AccessRoles");
const { TestRoute } = require("../controllers/productController");

router.route("/test").get(TestRoute);

module.exports = router;
