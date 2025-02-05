import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';
import { verifyToken } from './middleware/auth.js';
import userRoutes from './routes/users.js';
import friendRoutes from './routes/friends.js';
import postRoutes from './routes/posts.js';


dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log("Connected to MongoDB"))
   .catch((error) => console.log("MongoDB connection error:", error));

app.use('/api/auth', authRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/friends', verifyToken, friendRoutes);
app.use('/api/posts', verifyToken, postRoutes);

app.listen(5000);