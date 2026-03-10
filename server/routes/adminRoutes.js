import express from 'express';
import { getAdminStats, getAllUsers, getAllOrders } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getAllUsers);
router.get('/orders', protect, admin, getAllOrders);

export default router;
