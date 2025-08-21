import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

// We use a short-lived "socket token" (see /api/auth/socket-token)
const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized - No socket token'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) return next(new Error('Unauthorized - Invalid token'));

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return next(new Error('Unauthorized - User not found'));

    // Ensure tokenVersion matches (session still valid)
    if (decoded.tokenVersion !== user.tokenVersion) {
      return next(new Error('Session expired - tokenVersion mismatch'));
    }

    socket.user = user;
    next();
  } catch (err) {
    console.error('Socket auth error:', err.message);
    next(new Error('Unauthorized'));
  }
};

export default socketAuth;
