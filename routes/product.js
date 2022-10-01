const express = require("express");
const router = express.Router();
const { AuthenticateUser } = require("../middlewares/AuthenticateUser");
const { AccessRoles } = require("../middlewares/AccessRoles");
const {
  AddProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addReviewToProduct,
  deleteReviewToProduct,
  getAllReviewsOfProduct
} = require("../controllers/productController");

router
  .route("/admin/product/add")
  .post(AuthenticateUser, AccessRoles("admin"), AddProduct);
router.route("/products").get(getAllProducts);
router
  .route("/products/:id")
  .get(getSingleProduct)
  .put(AuthenticateUser, AccessRoles("admin"), updateProduct)
  .delete(AuthenticateUser, AccessRoles("admin"), deleteProduct);
router
  .route("/products/reviews/add")
  .post(AuthenticateUser, addReviewToProduct);
router
  .route("/products/reviews/delete/:productID")
  .delete(AuthenticateUser, deleteReviewToProduct);
  router
    .route("/products/:productID/reviews")
    .get(AuthenticateUser, getAllReviewsOfProduct);

module.exports = router;
