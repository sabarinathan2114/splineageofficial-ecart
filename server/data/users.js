import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        phoneNumber: '123-456-7890',
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'buyer',
        phoneNumber: '987-654-3210',
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'seller',
        phoneNumber: '555-0199',
    },
];

export default users;
