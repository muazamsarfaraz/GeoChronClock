import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection URI (from environment variables or default)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/geochronclock';

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    // For MVP, we'll make MongoDB connection optional
    // If it fails, we'll use in-memory storage
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn('Using in-memory storage instead');
    return false;
  }
};

export default connectDB;
