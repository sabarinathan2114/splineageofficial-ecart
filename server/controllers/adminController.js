import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ isSeller: true });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Financial Analytics
    const orders = await Order.find({ isPaid: true });
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Date-wise grouping (Today, Week, Month)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    const todaySales = (await Order.find({
        isPaid: true,
        paidAt: { $gte: today }
    })).reduce((acc, order) => acc + order.totalPrice, 0);

    const weekSales = (await Order.find({
        isPaid: true,
        paidAt: { $gte: weekAgo }
    })).reduce((acc, order) => acc + order.totalPrice, 0);

    const monthSales = (await Order.find({
        isPaid: true,
        paidAt: { $gte: monthAgo }
    })).reduce((acc, order) => acc + order.totalPrice, 0);

    // Stock Summary
    const lowStockProducts = await Product.find({ countInStock: { $lt: 5 } });

    res.json({
        counts: {
            users: totalUsers,
            sellers: totalSellers,
            products: totalProducts,
            orders: totalOrders,
        },
        financials: {
            totalSales,
            todaySales,
            weekSales,
            monthSales,
        },
        lowStock: lowStockProducts,
    });
});

// @desc    Get all users (for admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// @desc    Get all orders (for admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

export { getAdminStats, getAllUsers, getAllOrders };
