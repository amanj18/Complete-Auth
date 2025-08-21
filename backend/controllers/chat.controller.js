import jwt from 'jsonwebtoken';
import Message from '../models/message.models.js';
import User from '../models/user.models.js';

// Return short-lived token for Socket.IO (since httpOnly cookie isn’t readable from JS)
export const getSocketToken = async (req, res) => {
  try {
    const user = req.user; // from verifyToken (cookie)
    const token = jwt.sign(
      { userId: user._id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // short life
    );
    res.status(200).json({ token, success: true });
  } catch (e) {
    console.error('getSocketToken error:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch chat history between me and :peerId
export const getMessagesWithPeer = async (req, res) => {
  try {
    const me = String(req.user._id);
    const peer = String(req.params.peerId);

    const msgs = await Message.find({
      $or: [
        { senderId: me, receiverId: peer },
        { senderId: peer, receiverId: me },
      ],
    }).sort({ createdAt: 1 }).lean();

    // ✅ Normalize IDs to string
    const normalized = msgs.map(m => ({
      ...m,
      senderId: String(m.senderId),
      receiverId: String(m.receiverId),
    }));

    res.status(200).json({ success: true, messages: normalized });
  } catch (e) {
    console.error('getMessagesWithPeer error:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Simple users list (exclude me); select fields you need
export const listUsers = async (req, res) => {
  try {
    const me = String(req.user._id);
    const users = await User.find(
      { _id: { $ne: me } },
      { password: 0, verifyOtp: 0, resetOtp: 0, verifyOtpExpireAt: 0, resetOtpExpireAt: 0, tokenVersion: 0 }
    ).sort({ createdAt: -1 });

    res.status(200).json({ success: true, users });
  } catch (e) {
    console.error('listUsers error:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};
