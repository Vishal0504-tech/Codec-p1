import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public registration route: POST /api/auth/register
router.post('/register', registerUser);

// Public login route: POST /api/auth/login
router.post('/login', loginUser);

// Protected user profile route: GET /api/auth/profile
// The "protect" middleware runs first. If it succeeds, the request proceeds to "getUserProfile".
router.get('/profile', protect, getUserProfile);

export default router;
