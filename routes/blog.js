const express = require("express");

const router = express();

const blogController = require("../controllers/blog");
const { check } = require("express-validator");
const isAuth = require("../middleware/is-auth");

router.get("/", blogController.getMain);

router.get("/services", blogController.getServices);

router.get("/products", blogController.getProducts);

router.get("/posts", blogController.getPosts);

router.get("/service-categories", blogController.getServicesCategories);

router.get("/product-categories", blogController.getProductsCategories);

router.post(
  "/posts/:postId/comments",
  check("email")
      .isEmail()
      .withMessage("Please enter a valid email address."),
  blogController.postAddCommentPost
);

router.post(
  "/products/:productId/comments",
  check("email")
      .isEmail()
      .withMessage("Please enter a valid email address."),
  blogController.postAddCommentProduct
);

router.get("/products/:productId", blogController.getProduct);

router.get("/posts/:postId", blogController.getPost);

module.exports = router;
