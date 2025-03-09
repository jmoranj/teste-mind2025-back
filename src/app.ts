import cors from 'cors';
import express from "express";
import session from 'express-session';
import productRouter from "./routes/productRoutes";
import userRouter from "./routes/userRoutes";

const app = express()

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Verify JWT_SECRET is loaded
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ WARNING: JWT_SECRET environment variable is not set');
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRouter)
app.use('/product', productRouter)
app.use(cors())

export default app
