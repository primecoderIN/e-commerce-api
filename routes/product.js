const express = require("express");
const router = express.Router();
const { AuthenticateUser } = require("../middlewares/AuthenticateUser");
const { AccessRoles } = require("../middlewares/AccessRoles");
const {
  AddProduct,
  getAllProducts,
} = require("../controllers/productController");

router
  .route("/admin/product/add")
  .post(AuthenticateUser, AccessRoles("admin"), AddProduct);
router.route("/products").get(getAllProducts);

module.exports = router;
