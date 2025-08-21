import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { connectToDB } from './db/connect.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js'; 
import Message from './models/message.models.js';  
import socketAuth from './middleware/socketAuth.js';

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // needed for secure cookies on Render
}

// ✅ Allow exact origins (match your deployed frontend)
const allowedOrigins = [
  'http://localhost:5173',
  'https://complete-auth-check.vercel.app',
  'https://complete-auth-jp9tdocig-amanjais160-8974s-projects.vercel.app' // add your preview build too
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));
 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/chat', chatRoutes);

// --- Socket.IO setup ---
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

// ✅ verify socket JWT & attach socket.user
io.use(socketAuth);

// Presence: Map<userId, Set<socketId>>
const online = new Map();
const addSocket = (uid, sid) => {
  if (!online.has(uid)) online.set(uid, new Set());
  online.get(uid).add(sid);
};
const removeSocket = (uid, sid) => {
  const s = online.get(uid);
  if (!s) return;
  s.delete(sid);
  if (!s.size) online.delete(uid);
};
const onlineIds = () => Array.from(online.keys());

// Basic anti-spam throttle per socket
const lastSendAt = new Map(); // Map<socketId, ts>

// Socket events
io.on('connection', (socket) => {
  const me = String(socket.user._id);

  addSocket(me, socket.id);
  socket.join(`user:${me}`);
  io.emit('presence:update', onlineIds());

  socket.on('message:send', async ({ to, text }) => {
    if (!to || !text || !String(text).trim()) return;

    const now = Date.now();
    const last = lastSendAt.get(socket.id) || 0;
    if (now - last < 300) return; // drop bursts faster than 300ms
    lastSendAt.set(socket.id, now);

    // Persist message
    const doc = await Message.create({
      senderId: me,
      receiverId: String(to),
      text: String(text).trim(),
    });

    // Emit to both users’ rooms
    io.to(`user:${to}`).emit('message:new', doc);
    // io.to(`user:${me}`).emit('message:new', doc);
  });

  socket.on('disconnect', () => {
    removeSocket(me, socket.id);
    io.emit('presence:update', onlineIds());
  });
});

server.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});