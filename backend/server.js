import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectToDB } from './db/connect.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies

// AUTH ROUTES
app.use("/api/auth",authRoutes);

app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
