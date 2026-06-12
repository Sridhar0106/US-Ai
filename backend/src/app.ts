import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import interviewRoutes from './routes/interviewRoutes';
import resumeRoutes from './routes/resumeRoutes';
import roadmapRoutes from './routes/roadmapRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Global Middlewares
app.use(cors({
  origin: '*', // For development, allow all origins. In production, restrict to frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the InterviewAI API Server!' });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/admin', adminRoutes);

// Undefined Routes Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use(errorHandler as any);

// Start Express Server
app.listen(PORT, () => {
  console.log(`InterviewAI Server running on port ${PORT}...`);
});
