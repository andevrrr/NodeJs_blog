const express = require('express');

const router = express();

const Service = require("../models/service");
const Product = require("../models/product");
const Post = require("../models/post");

const adminController = require('../controllers/admin');

router.get('/add-service', adminController.getCreateService);

router.post('/add-service', adminController.postCreateService);

router.get('/add-product', adminController.getCreateProduct);

router.post('/add-product', adminController.postCreateProduct);

router.post('/delete-product/:productId', adminController.postDeleteProduct);

router.post('/delete-service/:serviceId', adminController.postDeleteService);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.get('/edit-service/:serviceId', adminController.getEditService);

router.post('/edit-service', adminController.postEditService);

router.get('/add-post', adminController.getCreatePost);

router.post('/add-post', adminController.postCreatePost);

router.post('/delete-post/:postId', adminController.postDeletePost);

router.get('/edit-post/:postId', adminController.getEditPost);

router.post('/edit-post', adminController.postEditPost);

router.post('/delete-comment/:postId/comments/:commentId', adminController.postDeleteCommentPost);

router.post('/delete-comment/:productId/comments/:commentId', adminController.postDeleteCommentProduct);

router.post('/products/status/:id', adminController.postStatus(Product, 'isVisible', '/products'));

router.post('/services/status/:id', adminController.postStatus(Service, 'isVisible', '/services'));

router.post('/posts/status/:id', adminController.postStatus(Post, 'isVisible', '/posts'));

router.post('/posts/featured/:id', adminController.postStatus(Post, 'isFeatured', '/posts'));

router.post('/products/featured/:id', adminController.postStatus(Product, 'isFeatured', '/products'));

router.post('/services/featured/:id', adminController.postStatus(Service, 'isFeatured', '/services'));

module.exports = router;