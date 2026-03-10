import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getRelatedProducts,
} from '../controllers/productController.js';
import { protect, admin, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, seller, createProduct);

router.get('/:id/related', getRelatedProducts);

router.route('/:id')
    .get(getProductById)
    .put(protect, seller, updateProduct)
    .delete(protect, seller, deleteProduct);

export default router;
