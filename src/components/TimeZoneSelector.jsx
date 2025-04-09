import { useState, useEffect } from 'react';
import { getAvailableTimezones } from '../services/timeService';
import './TimeZoneSelector.css';

/**
 * TimeZoneSelector Component
 * Allows users to select a timezone and add a clock for it
 *
 * @param {Object} props - Component props
 * @param {Function} props.onAddClock - Function to call when a clock is added
 */
const TimeZoneSelector = ({ onAddClock }) => {
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [customLabel, setCustomLabel] = useState('');
  const [timezones, setTimezones] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load available timezones
  useEffect(() => {
    const availableTimezones = getAvailableTimezones();
    setTimezones(availableTimezones);

    // Set default label based on selected timezone
    if (selectedTimezone) {
      const selected = availableTimezones.find(tz => tz.value === selectedTimezone);
      if (selected) {
        setCustomLabel(selected.label);
      }
    }
  }, []);

  // Update label when timezone changes
  useEffect(() => {
    if (selectedTimezone) {
      const selected = timezones.find(tz => tz.value === selectedTimezone);
      if (selected) {
        setCustomLabel(selected.label);
      }
    }
  }, [selectedTimezone, timezones]);

  const handleAddClock = () => {
    if (onAddClock && selectedTimezone) {
      onAddClock(selectedTimezone, customLabel);

      // Reset custom label after adding
      const selected = timezones.find(tz => tz.value === selectedTimezone);
      if (selected) {
        setCustomLabel(selected.label);
      }
    }
  };

  // Filter timezones based on search query
  const filteredTimezones = timezones.filter(tz => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      tz.value.toLowerCase().includes(query) ||
      tz.label.toLowerCase().includes(query)
    );
  });

  // Group timezones by continent
  const groupedTimezones = {};
  filteredTimezones.forEach(tz => {
    const parts = tz.value.split('/');
    const continent = parts[0];

    if (!groupedTimezones[continent]) {
      groupedTimezones[continent] = [];
    }

    groupedTimezones[continent].push(tz);
  });

  return (
    <div className="timezone-selector">
      <div className="selector-header">
        <h3>Add Custom Clock</h3>
        <button
          className="toggle-advanced-button"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Simple' : 'Advanced'}
        </button>
      </div>

      <div className="selector-content">
        {showAdvanced && (
          <input
            type="text"
            placeholder="Search timezones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="timezone-search"
          />
        )}

        <select
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
          className="timezone-dropdown"
          size={showAdvanced ? 5 : 1}
        >
          {showAdvanced ? (
            // Advanced view - grouped by continent
            Object.keys(groupedTimezones).sort().map(continent => (
              <optgroup key={continent} label={continent}>
                {groupedTimezones[continent].map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </optgroup>
            ))
          ) : (
            // Simple view - just popular timezones
            filteredTimezones
              .filter(tz => [
                'UTC',
                'America/New_York',
                'America/Los_Angeles',
                'America/Chicago',
                'Europe/London',
                'Europe/Paris',
                'Asia/Dubai',
                'Asia/Tokyo',
                'Asia/Shanghai',
                'Australia/Sydney',
                'Pacific/Auckland'
              ].includes(tz.value))
              .map(tz => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))
          )}
        </select>

        {showAdvanced && (
          <input
            type="text"
            placeholder="Custom label (optional)"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            className="custom-label-input"
          />
        )}

        <button
          onClick={handleAddClock}
          className="add-clock-button"
        >
          Add Clock
        </button>
      </div>
    </div>
  );
};

export default TimeZoneSelector;
