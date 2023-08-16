const express = require('express');

const router = express();

const blogController = require('../controllers/blog');

const isAuth = require('../middleware/is-auth');

router.get('/', blogController.getMain);

router.get('/services', blogController.getServices);

router.get('/products', blogController.getProducts);

router.get('/posts', blogController.getPosts);

router.post('/posts/:postId/comments', blogController.postAddCommentPost);

router.post('/products/:productId/comments', blogController.postAddCommentProduct);

router.get('/products/:productId', blogController.getProduct);

router.get('/posts/:postId', blogController.getPost);

module.exports = router;
