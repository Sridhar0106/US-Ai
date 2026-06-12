import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interviewai';
    console.log(`Connecting to MongoDB at: ${connStr}`);
    
    // Connect to database
    await mongoose.connect(connStr);
    
    console.log('MongoDB Database connected successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB database:', error);
    process.exit(1);
  }
};

export default connectDB;
