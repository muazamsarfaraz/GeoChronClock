// Event bus for configuration events
const configEvents = {
  listeners: {},
  subscribe: (event, callback) => {
    if (!configEvents.listeners[event]) {
      configEvents.listeners[event] = [];
    }
    configEvents.listeners[event].push(callback);
    return () => {
      configEvents.listeners[event] = configEvents.listeners[event].filter(cb => cb !== callback);
    };
  },
  emit: (event, data) => {
    if (configEvents.listeners[event]) {
      configEvents.listeners[event].forEach(callback => callback(data));
    }
  }
};

// Configuration events
export const ConfigEvents = {
  SAVE_START: 'save_start',
  SAVE_SUCCESS: 'save_success',
  SAVE_ERROR: 'save_error',
  LOAD_START: 'load_start',
  LOAD_SUCCESS: 'load_success',
  LOAD_ERROR: 'load_error'
};

/**
 * Subscribe to configuration events
 * @param {string} event - Event name from ConfigEvents
 * @param {Function} callback - Callback function
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToConfigEvents = (event, callback) => {
  return configEvents.subscribe(event, callback);
};

/**
 * Save user clock configuration to the server
 * @param {Array} clocks - Array of clock objects with timezone and label
 * @returns {Promise} - Promise that resolves to the server response
 */
export const saveConfiguration = async (clocks) => {
  try {
    // Emit save start event
    configEvents.emit(ConfigEvents.SAVE_START, { clocks });

    const response = await fetch('/api/save-configuration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clocks }),
    });

    const result = await response.json();

    if (result.success) {
      // Emit save success event
      configEvents.emit(ConfigEvents.SAVE_SUCCESS, result);
    } else {
      // Emit save error event
      configEvents.emit(ConfigEvents.SAVE_ERROR, {
        error: result.message || 'Unknown error'
      });
    }

    return result;
  } catch (error) {
    console.error('Error saving configuration:', error);

    // Emit save error event
    configEvents.emit(ConfigEvents.SAVE_ERROR, { error: error.message });

    return { success: false, error: error.message };
  }
};

/**
 * Load user clock configuration from the server
 * @returns {Promise} - Promise that resolves to the server response with clock configuration
 */
export const loadConfiguration = async () => {
  try {
    // Emit load start event
    configEvents.emit(ConfigEvents.LOAD_START);

    const response = await fetch('/api/load-configuration');
    const result = await response.json();

    if (result.success) {
      // Emit load success event
      configEvents.emit(ConfigEvents.LOAD_SUCCESS, result);
    } else {
      // Emit load error event
      configEvents.emit(ConfigEvents.LOAD_ERROR, {
        error: result.message || 'Unknown error'
      });
    }

    return result;
  } catch (error) {
    console.error('Error loading configuration:', error);

    // Emit load error event
    configEvents.emit(ConfigEvents.LOAD_ERROR, { error: error.message });

    return { success: false, error: error.message };
  }
};
