import express from 'express';
import { getStripeConfig } from '../controllers/configController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stripe', protect, getStripeConfig);

export default router;
