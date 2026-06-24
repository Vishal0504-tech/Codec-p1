import express from 'express';
import {
  getSummary,
  getOrders,
  deliverOrder,
  getUsers,
  deleteUser,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth and role protection middlewares globally to all endpoints under this router
router.use(protect);
router.use(admin);

// Summary statistics endpoint: GET /api/admin/summary
router.get('/summary', getSummary);

// User lists and management endpoints
router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .delete(deleteUser);

// Order lists and delivery endpoints
router.route('/orders')
  .get(getOrders);

router.route('/orders/:id/deliver')
  .put(deliverOrder);

export default router;
