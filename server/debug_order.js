import mongoose from 'mongoose';
import Order from './models/orderModel.js';
import dotenv from 'dotenv';
dotenv.config();

const orderId = '69ad10739fa06a7de3031a00';

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const order = await Order.findById(orderId);
        if (!order) {
            console.log('Order NOT found');
        } else {
            console.log('Order found:', order._id);
            console.log('Total Price:', order.totalPrice);
            console.log('Payment Method:', order.paymentMethod);
            console.log('Is Paid:', order.isPaid);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
