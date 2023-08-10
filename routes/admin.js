const express = require('express');

const router = express();

const Service = require("../models/service");
const Product = require("../models/product");
const Post = require("../models/post");

const isAuth = require('../middleware/is-auth');

const adminController = require('../controllers/admin');

router.get('/add-service', isAuth, adminController.getCreateService);

router.post('/add-service', isAuth, adminController.postCreateService);

router.get('/add-product', isAuth, adminController.getCreateProduct);

router.post('/add-product', isAuth, adminController.postCreateProduct);

router.post('/delete-product/:productId', isAuth, adminController.postDeleteProduct);

router.post('/delete-service/:serviceId', isAuth, adminController.postDeleteService);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.get('/edit-service/:serviceId', isAuth, adminController.getEditService);

router.post('/edit-service', isAuth, adminController.postEditService);

router.get('/add-post', isAuth, adminController.getCreatePost);

router.post('/add-post', isAuth, adminController.postCreatePost);

router.post('/delete-post/:postId', adminController.postDeletePost);

router.get('/edit-post/:postId', isAuth, adminController.getEditPost);

router.post('/edit-post', isAuth, adminController.postEditPost);

router.post('/delete-comment/post/:id/comments/:commentId', isAuth, adminController.postDeleteComment(Post, '/posts'));

router.post('/delete-comment/product/:id/comments/:commentId', isAuth, adminController.postDeleteComment(Product, '/details'));

router.post('/products/status/:id', isAuth, adminController.postStatus(Product, 'isVisible', '/products'));

router.post('/services/status/:id', isAuth, adminController.postStatus(Service, 'isVisible', '/services'));

router.post('/posts/status/:id', isAuth, adminController.postStatus(Post, 'isVisible', '/posts'));

router.post('/posts/featured/:id', isAuth, adminController.postStatus(Post, 'isFeatured', '/posts'));

router.post('/products/featured/:id', isAuth, adminController.postStatus(Product, 'isFeatured', '/products'));

router.post('/services/featured/:id', isAuth, adminController.postStatus(Service, 'isFeatured', '/services'));

module.exports = router;