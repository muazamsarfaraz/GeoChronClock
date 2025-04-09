import { useState } from 'react';
import AnalogClock from './AnalogClock';
import './ClockCollection.css';

/**
 * ClockCollection Component
 * Displays a collection of analog clocks for different timezones
 *
 * @param {Object} props - Component props
 * @param {Array} props.clocks - Array of clock objects with timezone and label
 * @param {Function} props.onRemoveClock - Function to call when a clock is removed
 */
const ClockCollection = ({ clocks = [], onRemoveClock }) => {
  const [layout, setLayout] = useState('grid'); // 'grid' or 'carousel'

  // Define different themes for variety
  const themes = ['light', 'dark', 'colorful'];

  const getClockTheme = (index) => {
    return themes[index % themes.length];
  };

  return (
    <div className="clock-collection">
      <div className="collection-header">
        <h3>Custom Clocks</h3>
        <div className="layout-controls">
          <button
            className={`layout-button ${layout === 'grid' ? 'active' : ''}`}
            onClick={() => setLayout('grid')}
            title="Grid Layout"
          >
            <span className="grid-icon">⊞</span>
          </button>
          <button
            className={`layout-button ${layout === 'carousel' ? 'active' : ''}`}
            onClick={() => setLayout('carousel')}
            title="Carousel Layout"
          >
            <span className="carousel-icon">⟷</span>
          </button>
        </div>
      </div>

      {clocks.length === 0 ? (
        <div className="no-clocks-message">
          No custom clocks added. Use the timezone selector to add clocks.
        </div>
      ) : (
        <div className={`clocks-container ${layout}`}>
          {clocks.map((clock, index) => (
            <div key={clock.id} className="clock-item" data-timezone={clock.timezone}>
              <AnalogClock
                timezone={clock.timezone}
                label={clock.label}
                size={layout === 'grid' ? 'medium' : 'large'}
                theme={getClockTheme(index)}
                showSeconds={true}
                showDigitalTime={true}
              />
              {onRemoveClock && (
                <button
                  className="remove-clock-button"
                  onClick={() => onRemoveClock(clock.id)}
                  title="Remove Clock"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClockCollection;
