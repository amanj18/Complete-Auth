import express from 'express';
import { login, logout, signup , logoutAll, sendVerifyOtp, verifyEmail, isAuthenticated, sendPasswordResetOtp, resetPassword} from '../controllers/auth.controller.js';
import verifyToken from '../middleware/verifyToken.js'; // Middleware to protect routes

const router = express.Router();

router.post('/signup',signup); // Sign up route

router.post('/login',login); // Login route

router.post('/logout',logout); // Logout route

router.post('/logout-all', verifyToken, logoutAll); // Logout all sessions route

router.post('/send-verify-otp',verifyToken, sendVerifyOtp); // Send verification OTP route

router.post('/verify-otp', verifyToken, verifyEmail); // Verify OTP route

router.post('/is-auth', verifyToken, isAuthenticated); // Check if user is authenticated

router.post('/send-resetPassword-otp', sendPasswordResetOtp); // Send password reset OTP route

router.post('/reset-password', resetPassword); // Reset password route


export default router;