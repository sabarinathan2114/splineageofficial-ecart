import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import razorpay from '../utils/razorpay.js';
import Order from '../models/orderModel.js';

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay/order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (order) {
        // Securely recalculate the amount on the backend
        // Note: Razorpay expects amount in paisa (INR * 100)
        const amount = Math.round(order.totalPrice * 100);

        const options = {
            amount: amount,
            currency: 'INR',
            receipt: `receipt_${order._id}`,
        };

        try {
            console.log('Initiating Razorpay Order for Order ID:', orderId);
            console.log('Amount (paisa):', amount);
            const razorpayOrder = await razorpay.orders.create(options);
            console.log('Razorpay Order Created successfully:', razorpayOrder.id);
            res.json({
                ...razorpayOrder,
                key_id: process.env.RAZORPAY_KEY_ID
            });
        } catch (error) {
            console.error('Razorpay Order Creation Error:', error);
            res.status(500);
            throw new Error(error.message);
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/razorpay/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET || 'placeholder_secret')
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        const order = await Order.findById(orderId);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentStatus = 'paid';
            order.orderStatus = 'paid'; // Align with enum
            order.paymentResult = {
                id: razorpay_payment_id,
                status: 'captured',
                update_time: new Date().toISOString(),
                email_address: req.user.email
            };

            const updatedOrder = await order.save();
            res.json({ success: true, order: updatedOrder });
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } else {
        res.status(400);
        throw new Error('Invalid signature. Payment verification failed.');
    }
});

export { createRazorpayOrder, verifyPayment };
