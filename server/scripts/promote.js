import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

const promoteUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = process.argv[2];
        const role = process.argv[3] || 'admin';

        if (!email) {
            console.error('Please provide an email: node scripts/promote.js email@example.com [role]');
            process.exit(1);
        }

        const user = await User.findOne({ email });

        if (user) {
            user.role = role;
            await user.save();
            console.log(`User ${email} promoted to ${role}`);
        } else {
            console.error(`User with email ${email} not found`);
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

promoteUser();
