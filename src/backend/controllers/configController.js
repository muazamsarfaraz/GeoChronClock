import mongoose from 'mongoose';
import UserConfig from '../models/UserConfig.js';
import memoryStorage from '../utils/memoryStorage.js';

// Flag to track if MongoDB is connected
let isMongoConnected = mongoose.connection.readyState === 1;

// Update MongoDB connection status when it changes
mongoose.connection.on('connected', () => {
  isMongoConnected = true;
  console.log('MongoDB connection established, using database storage');
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.log('MongoDB disconnected, using in-memory storage');
});

// Simple session-based user identification (for MVP)
// In a production app, this would use proper authentication
const getUserId = (req) => {
  // For now, we'll use a simple session ID or IP address
  return req.headers['x-session-id'] || req.ip || 'anonymous-user';
};

/**
 * Save user's clock configuration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const saveUserConfig = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { clocks } = req.body;

    if (!Array.isArray(clocks)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: clocks must be an array'
      });
    }

    // Use MongoDB if connected, otherwise use in-memory storage
    if (isMongoConnected) {
      // Find and update or create new config in MongoDB
      await UserConfig.findOneAndUpdate(
        { userId },
        {
          userId,
          clocks,
          updatedAt: Date.now()
        },
        { upsert: true, new: true }
      );
    } else {
      // Use in-memory storage
      memoryStorage.saveConfig(userId, clocks);
    }

    res.json({
      success: true,
      message: 'Configuration saved successfully',
      data: { userId }
    });
  } catch (error) {
    console.error('Error saving user configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving configuration'
    });
  }
};

/**
 * Get user's saved clock configuration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserConfig = async (req, res) => {
  try {
    const userId = getUserId(req);
    let userConfig = null;
    let clocks = [];

    // Use MongoDB if connected, otherwise use in-memory storage
    if (isMongoConnected) {
      // Find user's configuration in MongoDB
      userConfig = await UserConfig.findOne({ userId });
      if (userConfig) {
        clocks = userConfig.clocks;
      }
    } else {
      // Use in-memory storage
      userConfig = memoryStorage.getConfig(userId);
      if (userConfig) {
        clocks = userConfig.clocks;
      }
    }

    res.json({
      success: true,
      message: userConfig ? 'Configuration loaded successfully' : 'No configuration found for this user',
      data: { clocks }
    });
  } catch (error) {
    console.error('Error loading user configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while loading configuration'
    });
  }
};
