const express = require('express');

const router = express();

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

router.post('/products/status/:productId', adminController.postIsVisibleProduct);

router.post('/services/status/:serviceId', adminController.postIsVisibleService);

router.post('/posts/status/:postId', adminController.postIsVisiblePost);

router.post('/posts/featured/:postId', adminController.postIsFeaturedPost);

router.post('/products/featured/:productId', adminController.postIsFeaturedProduct);

router.post('/services/featured/:serviceId', adminController.postIsFeaturedService);

module.exports = router;