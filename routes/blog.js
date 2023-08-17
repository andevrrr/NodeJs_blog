const express = require("express");

const router = express();

const blogController = require("../controllers/blog");

const isAuth = require("../middleware/is-auth");

router.get("/", blogController.getMain);

router.get("/services", blogController.getServices);

router.get("/products", isAuth, blogController.getProducts);

router.get("/posts", isAuth, blogController.getPosts);

router.post(
  "/posts/:postId/comments",
  isAuth,
  blogController.postAddCommentPost
);

router.post(
  "/products/:productId/comments",
  isAuth,
  blogController.postAddCommentProduct
);

router.get("/products/:productId", isAuth, blogController.getProduct);

router.get("/posts/:postId", isAuth, blogController.getPost);

module.exports = router;
