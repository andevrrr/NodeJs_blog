const express = require('express');

const router = express();

const blogController = require('../controllers/blog');

router.get('/', blogController.getBlog);

module.exports = router;