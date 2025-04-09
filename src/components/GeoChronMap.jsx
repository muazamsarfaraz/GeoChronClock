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
  const zoomControlRef = useRef(null);

  useEffect(() => {
    try {
      console.log('Initializing map controller...');

      if (!map) {
        console.error('Map instance is undefined');
        return;
      }

      // Center the map and set zoom level
      const isMobile = window.innerWidth <= 768;
      map.setView([20, 0], isMobile ? 1 : 2);

      // Enable basic interactions for better user experience
      // but disable some to keep the map focused on the time visualization
      if (map.doubleClickZoom) map.doubleClickZoom.disable();
      if (map.boxZoom) map.boxZoom.disable();

      // Add zoom control to bottom right
      if (map.zoomControl) {
        try {
          map.zoomControl.remove(); // Remove default zoom control
        } catch (error) {
          console.warn('Could not remove default zoom control:', error);
        }
      }

      // Add custom zoom control
      try {
        zoomControlRef.current = L.control.zoom({ position: 'bottomright' });
        zoomControlRef.current.addTo(map);
      } catch (error) {
        console.warn('Could not add custom zoom control:', error);
      }

      // Disable attribution prefix
      if (map.attributionControl) {
        map.attributionControl.setPrefix('');
      }

      // Handle window resize
      const handleResize = () => {
        if (map) {
          const newIsMobile = window.innerWidth <= 768;
          map.setView([20, 0], newIsMobile ? 1 : 2);
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        console.log('Cleaning up map controller...');
        window.removeEventListener('resize', handleResize);

        // Clean up zoom control
        if (zoomControlRef.current && map) {
          try {
            map.removeControl(zoomControlRef.current);
          } catch (error) {
            console.warn('Could not remove zoom control during cleanup:', error);
          }
        }
      };
    } catch (error) {
      console.error('Error in MapController:', error);
    }
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

  // Log map initialization for debugging
  useEffect(() => {
    console.log('GeoChronMap component rendering, isMobile:', isMobile);
  }, []);

  return (
    <div className="geochron-map" style={{ height: '100%', minHeight: '450px' }}>
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
        style={{ height: '100%', minHeight: '450px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
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
