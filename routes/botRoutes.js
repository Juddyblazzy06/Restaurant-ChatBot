const express = require('express')
const router = express.Router()
const botController = require('../controllers/botController')
const paymentController = require('../controllers/paymentController')

router.post('/', botController.handleMessage)
router.get('/payment/callback', paymentController.paymentCallback)

module.exports = router
