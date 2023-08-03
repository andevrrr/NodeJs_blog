const express = require('express');

const router = express();

const adminController = require('../controllers/admin');

router.get('/add-service', adminController.getCreateService);

router.post('/add-service', adminController.postCreateService);

router.get('/add-product', adminController.getCreateProduct);

router.post('/add-product', adminController.postCreateProduct);

module.exports = router;