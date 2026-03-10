import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';

dotenv.config();

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({});
        console.log('--- PRODUCT IMAGE PATHS ---');
        products.forEach(p => {
            console.log(`Name: ${p.name}`);
            console.log(`Image: ${p.image}`);
        });
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkProducts();
