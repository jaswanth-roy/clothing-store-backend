const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middlewares/user');
const {sendStripeKey,sendrazorpayKey,capturePayment,caputurerazorpaypayment}=require('../controllers/paymentcontroller');

//payment routes
router.route("/stripekey").get(isLoggedIn,sendStripeKey);
router.route("/razorpaykey").get(isLoggedIn,sendrazorpayKey);
router.route("/capturestripe").post(isLoggedIn,capturePayment);
router.route("/capturerazorpay").post(isLoggedIn,caputurerazorpaypayment);



module.exports = router;