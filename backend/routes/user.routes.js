import express from 'express';
import verifyToken from '../middleware/verifyToken.js'; // Middleware to protect routes
import { getUserData, deleteAccount, editProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/data',verifyToken, getUserData); // Get user data route
router.delete('/delete', verifyToken, deleteAccount); // Delete account
router.put('/edit', verifyToken, editProfile); // Edit profile

export default router;