const Bigpromise=require('../middlewares/bigpromise');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.sendStripeKey=Bigpromise(async (req,res,next)=>{
    res.status(200).json({
        status:'success',
        stripekey:process.env.STRIPE_API_KEY,
    });
}
);

exports.capturePayment=Bigpromise(async (req,res,next)=>{
    const paymentIntent = await stripe.checkout.sessions.create({
        amount: req.body.amount,
        currency: 'eur',

        //optional
        metadata: {integration_check: 'accept_a_payment'},

        
      });
        res.status(200).json({
            status:'success',
            amount:req.body.amount,
            client_secret:paymentIntent.client_secret,
        });
});

exports.sendrazorpayKey=Bigpromise(async (req,res,next)=>{
    res.status(200).json({
        status:'success',
        razorpaykey:process.env.RAZORPAY_API_KEY,
    });
}
);

exports.caputurerazorpaypayment = Bigpromise(async (req, res, next) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: RAZORPAY_SECRET_KEY,
  });

  var options = {
    amount: req.body.amount,
    currency: 'INR',
  };
  const myOrder = await instance.orders.create(options);
    res.status(200).json({
        status:'true',
        amount:req.body.amount,
        order_id:myOrder
    });

    

    



});
    