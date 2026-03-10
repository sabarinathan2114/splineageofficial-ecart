import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import bcrypt from 'bcryptjs';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Category from './models/categoryModel.js';
import Tag from './models/tagModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();

await connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();
        await Tag.deleteMany();

        const hashedUsers = users.map((user) => {
            const salt = bcrypt.genSaltSync(10);
            return {
                ...user,
                password: bcrypt.hashSync(user.password, salt),
            };
        });

        const createdUsers = await User.insertMany(hashedUsers);

        const adminUser = createdUsers[0]._id;

        // Create Categories
        const uniqueCategories = [...new Set(products.map(p => p.category))];
        const categoryDocs = await Category.insertMany(
            uniqueCategories.map(name => ({
                name,
                description: `${name} products collection`,
                photo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' // Placeholder
            }))
        );

        const categoryMap = {};
        categoryDocs.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        const sampleProducts = products.map((product) => {
            return {
                ...product,
                user: adminUser,
                category: categoryMap[product.category],
                images: [product.image]
            };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
