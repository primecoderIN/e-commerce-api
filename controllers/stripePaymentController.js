const BigPromise = require("../middlewares/BigPromise");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = sendStripeKey = BigPromise(async (req, res, next) => {
  res.status(200).json({
    success: true,
    stripe_key: process.env.STRIPE_API_KEY,
  });
});

module.exports = capturePaymentStripe = BigPromise(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    //optional
    metadata: {
      integration_check: "accept_a_payment",
    },
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});
