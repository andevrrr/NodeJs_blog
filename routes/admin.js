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

module.exports = router;