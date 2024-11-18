const Stripe = require('stripe');
const stripe = Stripe('sk_test_51Pwpi4023TaI0bKzl1dal6jK7njGYiTgT3Qr7Nt184Qr3wCyrr5pS5BP18NXj9GQAyeb9260jYQuCHN500GRv0kb00cRGQqW18'); // Your Stripe secret key
const asyncHandler = require('express-async-handler');

// Create a payment intent
const createPaymentIntent = asyncHandler(async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create payment intent', error });
    }
});

module.exports = { createPaymentIntent };
