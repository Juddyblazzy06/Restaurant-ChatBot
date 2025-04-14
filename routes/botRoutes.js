const express = require('express')
const router = express.Router()
const { handleMessage } = require('../controllers/botController')
const {
  processPayment,
  paymentCallback,
} = require('../controllers/paymentController')

router.post('/', handleMessage)
router.post('/pay', processPayment)
router.get('/payment/callback', paymentCallback)

module.exports = router
