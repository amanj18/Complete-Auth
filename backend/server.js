import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectToDB } from './db/connect.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

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

app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
