import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                name: x.name,
                qty: x.qty,
                image: x.image,
                price: x.price,
                product: x._id, // Map frontend _id to backend product field
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.paymentStatus = 'paid';
        order.orderStatus = 'paid';
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

// @desc    Get seller orders
// @route   GET /api/orders/seller
// @access  Private/Seller
const getSellerOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({
        'orderItems.product': {
            $in: await (async () => {
                const Product = mongoose.model('Product');
                const sellerProducts = await Product.find({ user: req.user._id });
                return sellerProducts.map(p => p._id);
            })()
        }
    })
        .populate('user', 'id name email phoneNumber')
        .populate('orderItems.product', 'user');

    // For each order, only return the items that belong to this seller
    const filteredOrders = orders.map(order => {
        const orderObj = order.toObject();
        const myItems = orderObj.orderItems.filter(item => {
            return item.product && item.product.user && item.product.user.toString() === req.user._id.toString();
        });
        return { ...orderObj, orderItems: myItems };
    });

    res.json(filteredOrders);
});

const getSellerDashboardStats = asyncHandler(async (req, res) => {
    const Product = mongoose.model('Product');

    // Get all products for this seller
    const myProducts = await Product.find({
        user: req.user._id
    });
    const myProductIds = myProducts.map(p => p._id);

    // Get all paid orders containing seller products
    const allOrders = await Order.find({
        'orderItems.product': { $in: myProductIds },
        isPaid: true,
    }).populate('user', 'name email');

    // Filter only seller items in each order
    const enrichedOrders = allOrders.map(o => {
        const obj = o.toObject();
        const myItems = obj.orderItems.filter(item =>
            item.product && myProductIds.some(id => id.toString() === item.product.toString())
        );
        return { ...obj, orderItems: myItems };
    }).filter(o => o.orderItems.length > 0);

    // Time boundaries
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - 6); startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const calcStats = (orders) => {
        let units = 0, revenue = 0;
        orders.forEach(o => o.orderItems.forEach(item => {
            units += item.qty;
            revenue += item.qty * item.price;
        }));
        return { units, revenue: parseFloat(revenue.toFixed(2)) };
    };

    const filterByDate = (start) => enrichedOrders.filter(o => new Date(o.paidAt) >= start);

    const statsToday = calcStats(filterByDate(startOfToday));
    const statsWeek = calcStats(filterByDate(startOfWeek));
    const statsMonth = calcStats(filterByDate(startOfMonth));
    const statsAll = calcStats(enrichedOrders);

    // Low stock products (stock <= 5)
    const lowStock = myProducts
        .filter(p => p.countInStock <= 5)
        .sort((a, b) => a.countInStock - b.countInStock)
        .slice(0, 8)
        .map(p => ({ _id: p._id, name: p.name, image: p.image, countInStock: p.countInStock, price: p.price }));

    // Top selling products
    const salesMap = {};
    enrichedOrders.forEach(o => o.orderItems.forEach(item => {
        const pid = item.product?.toString();
        if (!salesMap[pid]) salesMap[pid] = { qty: 0, revenue: 0, name: item.name, image: item.image };
        salesMap[pid].qty += item.qty;
        salesMap[pid].revenue += item.qty * item.price;
    }));
    const topProducts = Object.entries(salesMap)
        .sort((a, b) => b[1].qty - a[1].qty)
        .map(([id, v]) => ({
            _id: id,
            name: v.name,
            image: v.image,
            totalSold: v.qty,
            revenue: parseFloat(v.revenue.toFixed(2)),
            category: myProducts.find(p => p._id.toString() === id)?.category
        }));

    // Add products with 0 sales to the list as well
    const unsoldProducts = myProducts
        .filter(p => !salesMap[p._id.toString()])
        .map(p => ({
            _id: p._id,
            name: p.name,
            image: p.image,
            totalSold: 0,
            revenue: 0,
            category: p.category
        }));

    const allProductPerformance = [...topProducts, ...unsoldProducts];

    // Recent orders (last 5)
    const recentOrders = enrichedOrders
        .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt))
        .slice(0, 5)
        .map(o => ({
            _id: o._id,
            customerName: o.user?.name || 'Guest',
            paidAt: o.paidAt,
            items: o.orderItems.length,
            revenue: parseFloat(o.orderItems.reduce((s, i) => s + i.qty * i.price, 0).toFixed(2)),
        }));

    res.json({
        totalProducts: myProducts.length,
        today: statsToday,
        week: statsWeek,
        month: statsMonth,
        allTime: statsAll,
        lowStock,
        topProducts: allProductPerformance,
        recentOrders,
    });
});

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, getSellerOrders, getSellerDashboardStats };
