const axios = require('axios')
require('dotenv').config()

const processPayment = async (req, res) => {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Payment configuration error')
  }

  const orderTotal = req.session.currentOrder.reduce(
    (sum, item) => sum + item.price,
    0
  )

  if (orderTotal <= 0) {
    throw new Error('No items in order')
  }

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        amount: orderTotal * 100,
        email: 'customer@example.com',
        callback_url: `${req.protocol}://${req.get(
          'host'
        )}/api/chat/payment/callback`,
        metadata: {
          order_items: req.session.currentOrder.map((item) => ({
            name: item.name,
            price: item.price,
          })),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Payment Error:', error.response?.data || error.message)
    throw error
  }
}

const paymentCallback = async (req, res) => {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
  const reference = req.query.reference

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
    )

    if (response.data.data.status === 'success') {
      // Update order status
      req.session.orderHistory.push({
        items: [...req.session.currentOrder],
        paymentStatus: 'completed',
        paymentReference: reference,
        timestamp: new Date(),
      })
      req.session.currentOrder = []

      res.json({
        message: 'Payment successful! Return to chat.',
        order: req.session.orderHistory[req.session.orderHistory.length - 1],
      })
    } else {
      res.json({ message: 'Payment verification failed.' })
    }
  } catch (error) {
    console.error('Payment Verification Error:', error)
    res.status(500).json({ message: 'Payment verification failed.' })
  }
}

module.exports = { processPayment, paymentCallback }
