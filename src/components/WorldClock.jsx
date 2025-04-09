import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import './WorldClock.css';

const WorldClock = ({ timezones = [] }) => {
  const [times, setTimes] = useState([]);
  
  useEffect(() => {
    // Initialize times
    updateTimes();
    
    // Update times every second
    const intervalId = setInterval(updateTimes, 1000);
    
    return () => clearInterval(intervalId);
  }, [timezones]);
  
  const updateTimes = () => {
    const now = moment();
    const updatedTimes = timezones.map(tz => ({
      timezone: tz,
      time: now.tz(tz).format('HH:mm:ss'),
      date: now.tz(tz).format('ddd, MMM D'),
      label: tz.split('/').pop().replace('_', ' ')
    }));
    
    setTimes(updatedTimes);
  };
  
  return (
    <div className="world-clock">
      <h3 className="world-clock-title">World Clock</h3>
      <div className="world-clock-list">
        {times.map((item, index) => (
          <div key={index} className="world-clock-item">
            <div className="world-clock-time">{item.time}</div>
            <div className="world-clock-info">
              <div className="world-clock-label">{item.label}</div>
              <div className="world-clock-date">{item.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldClock;
