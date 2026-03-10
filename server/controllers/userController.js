import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.role === 'admin',
            isSeller: user.role === 'seller',
            role: user.role,
            phoneNumber: user.phoneNumber,
            address: user.address,
            city: user.city,
            state: user.state,
            pincode: user.pincode,
            image: user.image,
            token,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phoneNumber, role, address, city, state, pincode } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        phoneNumber,
        address,
        city,
        state,
        pincode,
        role: role || 'buyer',
    });

    if (user) {
        const token = generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.role === 'admin',
            isSeller: user.role === 'seller',
            role: user.role,
            phoneNumber: user.phoneNumber,
            address: user.address,
            city: user.city,
            state: user.state,
            pincode: user.pincode,
            image: user.image,
            token,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.role === 'admin',
            isSeller: user.role === 'seller',
            role: user.role,
            phoneNumber: user.phoneNumber,
            address: user.address,
            city: user.city,
            state: user.state,
            pincode: user.pincode,
            image: user.image,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error('Can not delete admin user');
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.address = req.body.address || user.address;
        user.city = req.body.city || user.city;
        user.state = req.body.state || user.state;
        user.pincode = req.body.pincode || user.pincode;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phoneNumber: updatedUser.phoneNumber,
            address: updatedUser.address,
            city: updatedUser.city,
            state: updatedUser.state,
            pincode: updatedUser.pincode,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.address = req.body.address || user.address;
        user.city = req.body.city || user.city;
        user.state = req.body.state || user.state;
        user.pincode = req.body.pincode || user.pincode;

        if (req.body.image !== undefined) {
            user.image = req.body.image;
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.role === 'admin',
            isSeller: updatedUser.role === 'seller',
            role: updatedUser.role,
            phoneNumber: updatedUser.phoneNumber,
            address: updatedUser.address,
            city: updatedUser.city,
            state: updatedUser.state,
            pincode: updatedUser.pincode,
            image: updatedUser.image,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get seller stats
// @route   GET /api/users/:id/stats
// @access  Private/Admin
const getSellerStats = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user && user.role === 'seller') {
        const { default: Product } = await import('../models/productModel.js');
        const { default: Order } = await import('../models/orderModel.js');

        const totalProducts = await Product.countDocuments({ user: req.params.id });
        const outOfStock = await Product.countDocuments({ user: req.params.id, countInStock: { $lte: 0 } });

        // Find orders containing this seller's products to calculate sold/revenue
        // For simplicity, we can do an aggregation or just query products
        const products = await Product.find({ user: req.params.id });
        const productIds = products.map(p => p._id);

        const orders = await Order.find({ 'orderItems.product': { $in: productIds }, isPaid: true });

        let totalSold = 0;
        let totalRevenue = 0;

        orders.forEach(order => {
            order.orderItems.forEach(item => {
                if (productIds.some(pid => pid.equals(item.product))) {
                    totalSold += item.qty;
                    totalRevenue += item.qty * item.price;
                }
            });
        });

        res.json({
            seller: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phoneNumber,
                joined: user.createdAt,
                status: 'Active Vendor'
            },
            stats: {
                totalProducts,
                outOfStock,
                totalSold,
                balance: totalRevenue
            }
        });
    } else {
        res.status(404);
        throw new Error('Seller not found or user is not a seller');
    }
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    updateUserProfile,
    getSellerStats,
};
