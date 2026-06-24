import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRecommendations,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for getting recommendations (Public)
router.route('/:id/recommendations')
  .get(getRecommendations);

// Route for getting all products (Public) or creating a product (Admin only)
router.route('/')
  .get(getAllProducts)
  .post(protect, admin, createProduct);

// Route for getting, updating, or deleting a single product
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
