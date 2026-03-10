import express from 'express';
import {
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
} from '../controllers/userController.js';
import {
    addAddress,
    getUserAddresses,
    deleteAddress,
    updateAddress,
} from '../controllers/addressController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(registerUser)
    .get(protect, admin, getUsers);

router.post('/logout', logoutUser);
router.post('/login', authUser);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/:id/stats')
    .get(protect, admin, getSellerStats);

router.route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

// Address routes
router.route('/addresses')
    .post(protect, addAddress)
    .get(protect, getUserAddresses);

router.route('/addresses/:id')
    .delete(protect, deleteAddress)
    .put(protect, updateAddress);

export default router;
