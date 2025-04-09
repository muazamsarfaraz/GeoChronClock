import { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './CityPin.css';

const CityPin = ({ city }) => {
  const [time, setTime] = useState(city.time);
  const [isDaytime, setIsDaytime] = useState(city.isDaytime);
  
  // Update time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      // In a real implementation, we would recalculate the time
      // For now, we'll just update the seconds
      const newTime = { ...time };
      newTime.seconds = (newTime.seconds + 1) % 60;
      if (newTime.seconds === 0) {
        newTime.minutes = (newTime.minutes + 1) % 60;
        if (newTime.minutes === 0) {
          newTime.hours = (newTime.hours + 1) % 24;
        }
      }
      newTime.formattedTime = `${String(newTime.hours).padStart(2, '0')}:${String(newTime.minutes).padStart(2, '0')}:${String(newTime.seconds).padStart(2, '0')}`;
      setTime(newTime);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [time]);
  
  // Create a custom icon for the city
  const createCityIcon = () => {
    return L.divIcon({
      className: `city-pin ${isDaytime ? 'day' : 'night'}`,
      html: `
        <div class="city-pin-inner">
          <div class="city-pin-time">${time.formattedTime}</div>
          <div class="city-pin-dot"></div>
        </div>
      `,
      iconSize: [80, 40],
      iconAnchor: [40, 20]
    });
  };
  
  return (
    <Marker
      position={[city.lat, city.lng]}
      icon={createCityIcon()}
    >
      <Popup className="city-popup">
        <div className="city-popup-content">
          <h3>{city.name}</h3>
          <p className="city-time">{time.formattedTime}</p>
          <p className="city-timezone">{city.timezone}</p>
          <p className="city-daynight">
            {isDaytime ? '☀️ Daytime' : '🌙 Nighttime'}
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

export default CityPin;
