const BigPromise = require("../middlewares/BigPromise");
const Razorpay = require("razorpay");
const { v4: uuidV4 } = require("uuid");

module.exports = sendRazorKey = BigPromise(async (req, res, next) => {
  res.status(200).json({
    success: true,
    razorpay_key: process.env.RAZOR_API_KEY,
  });
});

module.exports = capturePaymentRazor = BigPromise(async (req, res, next) => {
  const instance = new Razorpay({
    key_id: process.env.RAZOR_API_KEY,
    key_secret: process.env.RAZOR_SECRET_KEY,
  });

  var options = {
    amount: req.body.amount,
    currency: "INR",
    receipt: uuidV4(),
  };
  const myOrder = await instance.orders.create(options);
  res.status(200).json({
    success: true,
    amount: req.body.amount,
    order: myOrder,
  });
});
