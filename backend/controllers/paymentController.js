const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        metadata: {
            company: "Ecommerce"
        },
    });

    res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret
    });
});


//API_SECREST_KEY ei tar kaj frontend e.. but ei ta dotenv te rakha hoice and tai ei function er maddone ei ta frontend e newa hobe.. ete kore backend er dotenv te apikey ta secure taklo...ei ta charao frontend e apikey ta direct use kora jaito
exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {

    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });

});