const express = require("express");

const router = express();

const Service = require("../models/service");
const Product = require("../models/product");
const Post = require("../models/post");

const isAuth = require("../middleware/is-auth");

const adminController = require("../controllers/admin");

router.get("/add-service", isAuth, adminController.getCreateService);

router.post("/add-service", isAuth, adminController.postCreateService);

router.post("/add-service-category",  adminController.postCreateServiceCategory);

router.post("/add-product-category",  adminController.postCreateProductCategory);

router.get("/get-service-category",  adminController.getServiceCategories);

router.get("/get-product-category",  adminController.getProductCategories);

//router.get("/get-service-with-category", isAuth, adminController.getServicesWithCategories);

router.get("/add-product", isAuth, adminController.getCreateProduct);

router.post("/add-product", isAuth, adminController.postCreateProduct);

router.post(
  "/delete-product/:productId",
  isAuth,
  adminController.postDeleteProduct
);

router.post(
  "/delete-service/:serviceId",
  isAuth,
  adminController.postDeleteService
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product/:productId",
  isAuth,
  adminController.postEditProduct
);

router.get("/edit-service/:serviceId", isAuth, adminController.getEditService);

router.post(
  "/edit-service/:serviceId",
  isAuth,
  adminController.postEditService
);

router.get("/add-post", isAuth, adminController.getCreatePost);

router.post("/add-post", isAuth, adminController.postCreatePost);

router.post("/delete-post/:postId", isAuth, adminController.postDeletePost);

router.get("/edit-post/:postId", isAuth, adminController.getEditPost);

router.post("/edit-post/:postId", isAuth, adminController.postEditPost);

router.post(
  "/delete-comment/post/:id/comments/:commentId",
  isAuth,
  adminController.postDeleteComment(Post, "/posts")
);

router.post(
  "/delete-comment/product/:id/comments/:commentId",
  isAuth,
  adminController.postDeleteComment(Product, "/details")
);

router.post(
  "/products/:id/status/isVisible",
  isAuth,
  adminController.postStatus(Product, "isVisible")
);

router.post(
  "/services/:id/status/isVisible",
  isAuth,
  adminController.postStatus(Service, "isVisible")
);

router.post(
  "/posts/:id/status/isVisible",
  isAuth,
  adminController.postStatus(Post, "isVisible")
);

router.post(
  "/posts/:id/status/isFeatured",
  isAuth,
  adminController.postStatus(Post, "isFeatured")
);

router.post(
  "/products/:id/status/isFeatured",
  isAuth,
  adminController.postStatus(Product, "isFeatured")
);

router.post(
  "/services/:id/status/isFeatured",
  isAuth,
  adminController.postStatus(Service, "isFeatured")
);

module.exports = router;
