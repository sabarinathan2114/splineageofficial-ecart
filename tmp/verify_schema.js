import mongoose from 'mongoose';
import User from '../server/models/userModel.js';
import Product from '../server/models/productModel.js';
import Order from '../server/models/orderModel.js';
import Address from '../server/models/addressModel.js';
import Category from '../server/models/categoryModel.js';
import Tag from '../server/models/tagModel.js';

console.log('Verifying Schema Changes...');

const verifySchema = () => {
    // User Model
    const userFields = Object.keys(User.schema.paths);
    console.log('User Role Field:', User.schema.path('role').options.enum);

    // Address Model
    console.log('Address Model defined:', !!Address);

    // Category Model
    console.log('Category Model defined:', !!Category);
    console.log('Category Photo Field:', !!Category.schema.path('photo'));

    // Tag Model
    console.log('Tag Model defined:', !!Tag);

    // Product Model
    console.log('Product Category Ref:', Product.schema.path('category').options.ref);
    console.log('Product Tags Ref:', Product.schema.path('tags').caster.options.ref);
    console.log('Product Images Field:', !!Product.schema.path('images'));

    // Order Model
    console.log('Order Status Enum:', Order.schema.path('orderStatus').options.enum);
    console.log('Payment Status Enum:', Order.schema.path('paymentStatus').options.enum);
};

try {
    verifySchema();
    console.log('Schema verification structure check complete (Manual check of output required).');
} catch (error) {
    console.error('Schema verification failed:', error);
}

process.exit();
