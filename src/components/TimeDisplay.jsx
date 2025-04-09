import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import './TimeDisplay.css';

const TimeDisplay = ({ timezone = 'UTC' }) => {
  const [currentTime, setCurrentTime] = useState(moment().tz(timezone));
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Update time every second
    const intervalId = setInterval(() => {
      setCurrentTime(moment().tz(timezone));
      // Add animation class briefly
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [timezone]);
  
  return (
    <div className="time-display">
      <div className="time-container">
        <div className={`time ${isAnimating ? 'pulse' : ''}`}>
          {currentTime.format('HH:mm:ss')}
        </div>
        <div className="date">
          {currentTime.format('dddd, MMMM D, YYYY')}
        </div>
        <div className="timezone">
          {timezone.replace('_', ' ')}
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay;
