import express from 'express';
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    getSellerOrders,
    getSellerDashboardStats,
} from '../controllers/orderController.js';
import { protect, admin, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

router
    .route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/seller').get(protect, getSellerOrders);
router.route('/seller/dashboard').get(protect, seller, getSellerDashboardStats);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);

export default router;
