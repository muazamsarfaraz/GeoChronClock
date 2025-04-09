import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import './GeoChronMap.css';
import DayNightOverlay from './DayNightOverlay';
import TimeDisplay from './TimeDisplay';
import WorldClock from './WorldClock';
import CityPin from './CityPin';
import { getMajorCities } from '../services/timeService';

// Component to handle map initialization and updates
const MapController = () => {
  const map = useMap();

  useEffect(() => {
    // Center the map and set zoom level
    const isMobile = window.innerWidth <= 768;
    map.setView([20, 0], isMobile ? 1 : 2);

    // Enable basic interactions for better user experience
    // but disable some to keep the map focused on the time visualization
    map.doubleClickZoom.disable();
    map.boxZoom.disable();

    // Add zoom control to bottom right
    map.zoomControl.remove(); // Remove default zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Disable attribution prefix
    map.attributionControl.setPrefix('');

    // Handle window resize
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      map.setView([20, 0], newIsMobile ? 1 : 2);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  return null;
};

const GeoChronMap = () => {
  const mapRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cities, setCities] = useState([]);

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };

    // Update cities data
    setCities(getMajorCities());

    // Set up interval for updating time
    const intervalId = setInterval(updateTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Update cities when time changes
  useEffect(() => {
    setCities(getMajorCities());
  }, [currentTime]);

  // Detect if we're on a mobile device
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="geochron-map">
      <MapContainer
        ref={mapRef}
        center={[20, 0]}
        zoom={isMobile ? 1 : 2}
        minZoom={isMobile ? 1 : 2}
        maxZoom={4}
        zoomControl={false}
        attributionControl={false}
        className="map-container"
        scrollWheelZoom={true}
        dragging={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
        />

        {/* Day/Night Overlay */}
        <DayNightOverlay date={currentTime} />

        {/* City Pins */}
        {cities.map((city) => (
          <CityPin key={city.name} city={city} />
        ))}

        {/* Time Display */}
        <div className="map-overlay top-right">
          <TimeDisplay timezone="UTC" />
        </div>

        {/* World Clock */}
        <div className="map-overlay bottom-left">
          <WorldClock timezones={['America/New_York', 'Europe/London', 'Asia/Dubai', 'Asia/Tokyo']} />
        </div>

        <MapController />
      </MapContainer>
    </div>
  );
};

export default GeoChronMap;
