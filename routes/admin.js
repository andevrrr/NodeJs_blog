const express = require('express');

const router = express();

const Service = require("../models/service");
const Product = require("../models/product");
const Post = require("../models/post");

const isAuth = require('../middleware/is-auth');

const adminController = require('../controllers/admin');

router.get('/add-service',  adminController.getCreateService);

router.post('/add-service',  adminController.postCreateService);

router.get('/add-product',  adminController.getCreateProduct);

router.post('/add-product',  adminController.postCreateProduct);

router.post('/delete-product/:productId',  adminController.postDeleteProduct);

router.post('/delete-service/:serviceId',  adminController.postDeleteService);

router.get('/edit-product/:productId',  adminController.getEditProduct);

router.post('/edit-product/:productId',  adminController.postEditProduct);

router.get('/edit-service/:serviceId',  adminController.getEditService);

router.post('/edit-service/:serviceId',  adminController.postEditService);

router.get('/add-post',  adminController.getCreatePost);

router.post('/add-post',  adminController.postCreatePost);

router.post('/delete-post/:postId', adminController.postDeletePost);

router.get('/edit-post/:postId',  adminController.getEditPost);

router.post('/edit-post/:postId', adminController.postEditPost);

router.post('/delete-comment/post/:id/comments/:commentId',  adminController.postDeleteComment(Post, '/posts'));

router.post('/delete-comment/product/:id/comments/:commentId',  adminController.postDeleteComment(Product, '/details'));

router.post('/products/status/:id',  adminController.postStatus(Product, 'isVisible', '/products'));

router.post('/services/status/:id',  adminController.postStatus(Service, 'isVisible', '/services'));

router.post('/posts/status/:id',  adminController.postStatus(Post, 'isVisible', '/posts'));

router.post('/posts/featured/:id',  adminController.postStatus(Post, 'isFeatured', '/posts'));

router.post('/products/featured/:id',  adminController.postStatus(Product, 'isFeatured', '/products'));

router.post('/services/featured/:id',  adminController.postStatus(Service, 'isFeatured', '/services'));

module.exports = router;