const express = require('express');

const router = express();

const blogController = require('../controllers/blog');

const isAuth = require('../middleware/is-auth');

router.get('/', blogController.getMain);

router.get('/services', blogController.getServices);

router.get('/products', blogController.getProducts);

router.get('/posts', blogController.getPosts);

module.exports = router;