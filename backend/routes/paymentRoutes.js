import express from 'express';
import { createCheckoutSession } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Private route to initialize a Stripe checkout session: POST /api/payment/create-checkout-session
router.post('/create-checkout-session', protect, createCheckoutSession);

export default router;
