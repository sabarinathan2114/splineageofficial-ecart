import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import Tag from '../models/tagModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword;
    let query = {};

    if (keyword) {
        // Find categories that match the keyword
        const categories = await Category.find({
            name: { $regex: keyword, $options: 'i' }
        });
        const categoryIds = categories.map(cat => cat._id);

        query = {
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { category: { $in: categoryIds } }
            ]
        };
    }

    const products = await Product.find(query)
        .populate('category')
        .populate('tags')
        .populate('user', 'id name email');
    res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category').populate('tags');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    try {
        const product = new Product({
            name: 'Sample name',
            price: 0,
            user: req.user._id,
            image: '/images/sample.jpg',
            brand: 'Sample brand',
            category: req.body.category || '650000000000000000000000', // Placeholder ObjectID or expect from body
            countInStock: 0,
            numReviews: 0,
            rating: 0,
            description: 'Sample description',
            images: ['/images/sample.jpg'],
            tags: [],
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Product Creation Error:', error);
        res.status(400);
        throw new Error(`Product Creation Failed: ${error.message}`);
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;
        product.images = req.body.images || product.images;
        product.tags = req.body.tags || product.tags;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        const related = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
        }).limit(4).populate('category');
        res.json(related);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    getRelatedProducts
};
