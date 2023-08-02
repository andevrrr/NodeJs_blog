const express = require('express');

const router = express();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignUp);

router.post('/signup', authController.postSignUp);

module.exports = router;