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

const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://complete-auth-phi.vercel.app', // Vercel deployment
];

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({
  origin: allowedOrigins, // Allow requests from the frontend URL
  credentials: true, // Allow cookies to be sent with requests
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
