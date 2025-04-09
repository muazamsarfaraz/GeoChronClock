import mongoose from 'mongoose';

// Define the schema for user clock configurations
const ClockSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  timezone: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
});

const UserConfigSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  clocks: [ClockSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
UserConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const UserConfig = mongoose.model('UserConfig', UserConfigSchema);

export default UserConfig;
