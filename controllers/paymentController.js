const axios = require("axios");

exports.processPayment = async (req, res) => {
  const PAYSTACK_SECRET_KEY = "sk_test_..."; // Replace with your key
  const orderTotal = req.session.order.getCurrentOrder().reduce((sum, item) => sum + item.price, 0);
  
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount: orderTotal * 100,
        email: "customer@example.com",
      },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
    );
    res.redirect(response.data.data.authorization_url);
  } catch (error) {
    res.status(500).json({ message: "Payment failed" });
  }
};

exports.paymentCallback = (req, res) => {
  if (req.query.trxref === "success") {
    res.json({ message: "Payment successful! Return to chat." });
  } else {
    res.json({ message: "Payment failed." });
  }
};
