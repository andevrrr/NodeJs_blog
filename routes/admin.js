const express = require('express');

const router = express();

const adminController = require('../controllers/admin');

router.get('/add-service', adminController.getCreateService);

router.post('/add-service', adminController.postCreateService);

module.exports = router;