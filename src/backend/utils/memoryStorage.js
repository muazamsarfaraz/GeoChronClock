/**
 * Simple in-memory storage for user configurations
 * Used as a fallback when MongoDB is not available
 */

// In-memory storage object
const storage = {
  userConfigs: new Map()
};

/**
 * Save a user configuration to memory
 * @param {string} userId - User identifier
 * @param {Array} clocks - Array of clock objects
 * @returns {Object} - Saved configuration
 */
export const saveConfig = (userId, clocks) => {
  const config = {
    userId,
    clocks,
    updatedAt: new Date()
  };
  
  storage.userConfigs.set(userId, config);
  return config;
};

/**
 * Get a user configuration from memory
 * @param {string} userId - User identifier
 * @returns {Object|null} - User configuration or null if not found
 */
export const getConfig = (userId) => {
  return storage.userConfigs.get(userId) || null;
};

/**
 * Delete a user configuration from memory
 * @param {string} userId - User identifier
 * @returns {boolean} - True if deleted, false if not found
 */
export const deleteConfig = (userId) => {
  return storage.userConfigs.delete(userId);
};

/**
 * Get all user configurations from memory
 * @returns {Array} - Array of all user configurations
 */
export const getAllConfigs = () => {
  return Array.from(storage.userConfigs.values());
};

export default {
  saveConfig,
  getConfig,
  deleteConfig,
  getAllConfigs
};
