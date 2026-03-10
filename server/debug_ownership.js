import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';
import User from './models/userModel.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

const debug = async () => {
    const products = await Product.find({}).populate('user', 'name email');
    console.log('--- PRODUCTS IN DB ---');
    products.forEach(p => {
        console.log(`Product: ${p.name}, Owner: ${p.user?.name} (${p.user?.email})`);
    });
    process.exit();
};

debug();
