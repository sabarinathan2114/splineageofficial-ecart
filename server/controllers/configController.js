import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// @desc    Get Stripe client secret
// @route   POST /api/config/stripe
// @access  Private
const getStripeConfig = asyncHandler(async (req, res) => {
    res.json({
        publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

export { getStripeConfig };
