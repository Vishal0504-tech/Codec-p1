import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  confirmOrder,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Private route to confirm order after Stripe session completes
router.route('/confirm')
  .post(protect, confirmOrder);

// Private route to create a new order or list current user's past purchases
router.route('/')
  .post(protect, createOrder);

// Private route to list logged-in user's orders
router.route('/myorders')
  .get(protect, getMyOrders);

// Private route to fetch a single order details by ID
router.route('/:id')
  .get(protect, getOrderById);

export default router;
