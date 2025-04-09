import { useState } from 'react';
import './Help.css';

/**
 * Help Component
 * Provides user guidance for the application
 */
const Help = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  
  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };
  
  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'map', title: 'World Map' },
    { id: 'cities', title: 'City Pins' },
    { id: 'clocks', title: 'Custom Clocks' },
    { id: 'timezones', title: 'Time Zones' }
  ];
  
  return (
    <div className="help-container">
      <button 
        className={`help-button ${isOpen ? 'active' : ''}`}
        onClick={toggleHelp}
        title="Help"
      >
        ?
      </button>
      
      {isOpen && (
        <div className="help-panel">
          <div className="help-header">
            <h2>GeoChronClock Help</h2>
            <button 
              className="help-close-button"
              onClick={toggleHelp}
            >
              ✕
            </button>
          </div>
          
          <div className="help-navigation">
            {sections.map(section => (
              <button
                key={section.id}
                className={`help-nav-button ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.title}
              </button>
            ))}
          </div>
          
          <div className="help-content">
            {activeSection === 'overview' && (
              <div className="help-section">
                <h3>Welcome to GeoChronClock</h3>
                <p>
                  GeoChronClock is a global time visualization tool that helps you track time across different time zones.
                  It features a world map with day/night visualization, major city time pins, and customizable analog clocks.
                </p>
                <p>
                  Use the navigation buttons above to learn more about specific features.
                </p>
              </div>
            )}
            
            {activeSection === 'map' && (
              <div className="help-section">
                <h3>World Map with Day/Night Gradient</h3>
                <p>
                  The main map displays the current day/night gradient across the world.
                  The illuminated areas represent daytime, while the darker areas represent nighttime.
                </p>
                <p>
                  The gradient updates in real-time as the Earth rotates.
                </p>
                <p>
                  You can zoom and pan the map to focus on specific regions.
                </p>
              </div>
            )}
            
            {activeSection === 'cities' && (
              <div className="help-section">
                <h3>Major City Time Pins</h3>
                <p>
                  The map displays pins for major cities (London, New York, Dubai, and Tokyo) with their current local times.
                </p>
                <p>
                  Click on a pin to see more details about the city's time, including:
                </p>
                <ul>
                  <li>Current time in 24-hour format</li>
                  <li>Time zone information</li>
                  <li>Whether it's currently day or night in that location</li>
                </ul>
              </div>
            )}
            
            {activeSection === 'clocks' && (
              <div className="help-section">
                <h3>Custom Analog Clocks</h3>
                <p>
                  You can add custom analog clocks for any time zone you're interested in tracking.
                </p>
                <p>
                  To add a clock:
                </p>
                <ol>
                  <li>Use the time zone selector to choose a time zone</li>
                  <li>Click the "Add Clock" button</li>
                  <li>Your new clock will appear in the clocks section</li>
                </ol>
                <p>
                  To remove a clock, hover over it and click the "✕" button that appears.
                </p>
                <p>
                  You can switch between grid and carousel layouts using the buttons in the clock collection header.
                </p>
              </div>
            )}
            
            {activeSection === 'timezones' && (
              <div className="help-section">
                <h3>Time Zone Selection</h3>
                <p>
                  The time zone selector allows you to choose from a comprehensive list of time zones around the world.
                </p>
                <p>
                  In simple mode, you'll see a dropdown with common time zones.
                </p>
                <p>
                  For more options, click the "Advanced" button to access:
                </p>
                <ul>
                  <li>A searchable list of all available time zones</li>
                  <li>Time zones grouped by continent</li>
                  <li>Custom label option for your clocks</li>
                </ul>
                <p>
                  Each time zone is displayed with its GMT offset for easy reference.
                </p>
              </div>
            )}
          </div>
          
          <div className="help-footer">
            <p>GeoChronClock v1.0.0 | &copy; 2023</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;
