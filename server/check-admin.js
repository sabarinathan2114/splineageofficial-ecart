import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const checkAdmin = async () => {
    await connectDB();
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
        console.log('Admin user not found in DB!');
    } else {
        console.log('Admin user found:', adminUser.email, 'Role:', adminUser.role);
        const isMatch = await bcrypt.compare('password123', adminUser.password);
        console.log('Password match for "password123":', isMatch);
    }
    process.exit();
};

checkAdmin();
