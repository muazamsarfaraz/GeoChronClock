import { useState, useEffect } from 'react';
import './Notification.css';

/**
 * Notification Component
 * Displays a notification message with different styles based on type
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - The message to display
 * @param {string} props.type - The type of notification ('success', 'error', 'info', 'warning')
 * @param {number} props.duration - How long to show the notification in milliseconds
 * @param {boolean} props.show - Whether to show the notification
 * @param {Function} props.onClose - Function to call when notification is closed
 */
const Notification = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  show = false,
  onClose 
}) => {
  const [visible, setVisible] = useState(show);
  const [animateOut, setAnimateOut] = useState(false);
  
  useEffect(() => {
    if (show) {
      setVisible(true);
      setAnimateOut(false);
      
      // Set a timeout to hide the notification after duration
      const timer = setTimeout(() => {
        setAnimateOut(true);
        
        // Wait for animation to complete before fully hiding
        setTimeout(() => {
          setVisible(false);
          if (onClose) onClose();
        }, 300);
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      setAnimateOut(true);
      
      // Wait for animation to complete before fully hiding
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);
  
  // Don't render anything if not visible
  if (!visible) return null;
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };
  
  return (
    <div className={`notification ${type} ${animateOut ? 'fade-out' : 'fade-in'}`}>
      <div className="notification-icon">{getIcon()}</div>
      <div className="notification-message">{message}</div>
      <button 
        className="notification-close"
        onClick={() => {
          setAnimateOut(true);
          setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
          }, 300);
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default Notification;
