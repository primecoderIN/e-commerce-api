const express = require("express");
const router = express.Router();
const { AuthenticateUser } = require("../middlewares/AuthenticateUser");
const { AccessRoles } = require("../middlewares/AccessRoles");
const {
  AddProduct,
  getAllProducts,
  getSingleProduct
} = require("../controllers/productController");

router
  .route("/admin/product/add")
  .post(AuthenticateUser, AccessRoles("admin"), AddProduct);
router.route("/products").get(getAllProducts);
router.route("/products/:id").get(getSingleProduct);

module.exports = router;
