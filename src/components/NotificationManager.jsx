import { useState, useEffect } from 'react';
import Notification from './Notification';
import { subscribeToConfigEvents, ConfigEvents } from '../services/configService';
import './NotificationManager.css';

/**
 * NotificationManager Component
 * Manages and displays multiple notifications
 */
const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // Subscribe to configuration events
    const unsubscribeSaveStart = subscribeToConfigEvents(
      ConfigEvents.SAVE_START,
      () => {
        addNotification({
          id: Date.now(),
          message: 'Saving your configuration...',
          type: 'info',
          duration: 2000
        });
      }
    );
    
    const unsubscribeSaveSuccess = subscribeToConfigEvents(
      ConfigEvents.SAVE_SUCCESS,
      () => {
        addNotification({
          id: Date.now(),
          message: 'Configuration saved successfully!',
          type: 'success',
          duration: 3000
        });
      }
    );
    
    const unsubscribeSaveError = subscribeToConfigEvents(
      ConfigEvents.SAVE_ERROR,
      (data) => {
        addNotification({
          id: Date.now(),
          message: `Error saving configuration: ${data.error}`,
          type: 'error',
          duration: 5000
        });
      }
    );
    
    const unsubscribeLoadStart = subscribeToConfigEvents(
      ConfigEvents.LOAD_START,
      () => {
        addNotification({
          id: Date.now(),
          message: 'Loading your configuration...',
          type: 'info',
          duration: 2000
        });
      }
    );
    
    const unsubscribeLoadSuccess = subscribeToConfigEvents(
      ConfigEvents.LOAD_SUCCESS,
      () => {
        addNotification({
          id: Date.now(),
          message: 'Configuration loaded successfully!',
          type: 'success',
          duration: 3000
        });
      }
    );
    
    const unsubscribeLoadError = subscribeToConfigEvents(
      ConfigEvents.LOAD_ERROR,
      (data) => {
        addNotification({
          id: Date.now(),
          message: `Error loading configuration: ${data.error}`,
          type: 'error',
          duration: 5000
        });
      }
    );
    
    // Clean up subscriptions
    return () => {
      unsubscribeSaveStart();
      unsubscribeSaveSuccess();
      unsubscribeSaveError();
      unsubscribeLoadStart();
      unsubscribeLoadSuccess();
      unsubscribeLoadError();
    };
  }, []);
  
  // Add a new notification
  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
  };
  
  // Remove a notification by ID
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  return (
    <div className="notification-manager">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          show={true}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationManager;
