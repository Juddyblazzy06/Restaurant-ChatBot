const express = require('express');
const router = express.Router();
const botController = require('../controllers/botController');
const paymentController = require('../controllers/paymentController');

router.post('/', botController.handleMessage);
router.post('/pay', paymentController.handlePayment);

module.exports = router;
