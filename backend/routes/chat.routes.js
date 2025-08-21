import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getSocketToken, getMessagesWithPeer, listUsers } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/socket-token', verifyToken, getSocketToken);     // returns short-lived token for socket.connect
router.get('/users', verifyToken, listUsers);                 // list users (excluding me)
router.get('/messages/:peerId', verifyToken, getMessagesWithPeer); // history with peer

export default router;
