import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectToDB } from './db/connect.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// trust proxy when behind Render/other proxies (needed for secure cookies)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}


const PORT = process.env.PORT || 5000;


app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'https://complete-auth-phi.vercel.app',
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

app.options("*", cors());

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// USER ROUTES
app.use("/api/user", userRoutes);


app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
