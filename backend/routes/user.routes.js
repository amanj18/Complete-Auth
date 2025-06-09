import express from 'express';
import { login, logout, signup , logoutAll, sendVerifyOtp, verifyEmail, isAuthenticated, sendPasswordResetOtp, resetPassword} from '../controllers/auth.controller.js';
import verifyToken from '../middleware/verifyToken.js'; // Middleware to protect routes
import { getUserData } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/data',verifyToken, getUserData); // Get user data route

export default router;