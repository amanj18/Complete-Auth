import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup',signup); // Sign up route

router.post('/login',login); // Login route

router.post('/logout',logout); // Logout route


export default router;