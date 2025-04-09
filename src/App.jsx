import { useState, useEffect } from 'react';
import './App.css';
import GeoChronMap from './components/GeoChronMap';
import ClockCollection from './components/ClockCollection';
import TimeZoneSelector from './components/TimeZoneSelector';
import NotificationManager from './components/NotificationManager';
import Help from './components/Help';
import { loadConfiguration, saveConfiguration } from './services/configService';
import { getAvailableTimezones } from './services/timeService';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

function App() {
  const [customClocks, setCustomClocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved configuration on component mount
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await loadConfiguration();
        if (response.success && response.data && response.data.clocks) {
          setCustomClocks(response.data.clocks);
        }
      } catch (error) {
        console.error('Error loading configuration:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleAddClock = (timezone, customLabel = '') => {
    // Generate a label if none provided
    const label = customLabel || timezone.split('/').pop().replace('_', ' ');

    const newClock = {
      id: Date.now(), // Simple unique ID
      timezone,
      label
    };

    const updatedClocks = [...customClocks, newClock];
    setCustomClocks(updatedClocks);

    // Save the updated configuration
    saveConfiguration(updatedClocks).catch(error => {
      console.error('Error saving configuration:', error);
    });
  };

  const handleRemoveClock = (clockId) => {
    const updatedClocks = customClocks.filter(clock => clock.id !== clockId);
    setCustomClocks(updatedClocks);

    // Save the updated configuration
    saveConfiguration(updatedClocks).catch(error => {
      console.error('Error saving configuration:', error);
    });
  };

  return (
    <div className="app-container">
      <header>
        <h1>GeoChron Clock</h1>
      </header>
      <main>
        <div className="geochron-container">
          <GeoChronMap />
        </div>

        <div className="timezone-selector-container">
          <TimeZoneSelector onAddClock={handleAddClock} />
        </div>

        <div className="clocks-container">
          {loading ? (
            <div className="loading">Loading saved clocks...</div>
          ) : (
            <ClockCollection
              clocks={customClocks}
              onRemoveClock={handleRemoveClock}
            />
          )}
        </div>
      </main>
      <footer>
        <p>GeoChron Clock - A global time visualization tool</p>
      </footer>

      {/* Notification Manager */}
      <NotificationManager />

      {/* Help Component */}
      <Help />
    </div>
  );
}

export default App;
