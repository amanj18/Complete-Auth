import express from 'express';
import { login, logout, signup , logoutAll} from '../controllers/auth.controller.js';
import verifyToken from '../middleware/verifyToken.js'; // Middleware to protect routes

const router = express.Router();

router.post('/signup',signup); // Sign up route

router.post('/login',login); // Login route

router.post('/logout',logout); // Logout route

router.post('/logout-all', verifyToken, logoutAll); // Logout all sessions route


export default router;