import { useState, useEffect, useRef } from 'react';
import moment from 'moment-timezone';
import './AnalogClock.css';

/**
 * AnalogClock Component
 * A customizable analog clock that displays time for any timezone
 *
 * @param {Object} props - Component props
 * @param {string} props.timezone - Timezone string (e.g., 'America/New_York')
 * @param {string} props.label - Label to display below the clock
 * @param {string} props.size - Size of the clock ('small', 'medium', 'large')
 * @param {string} props.theme - Color theme ('light', 'dark', 'colorful')
 * @param {boolean} props.showSeconds - Whether to show the seconds hand
 * @param {boolean} props.showDigitalTime - Whether to show digital time below the clock
 */
const AnalogClock = ({
  timezone = 'UTC',
  label = 'UTC',
  size = 'medium',
  theme = 'light',
  showSeconds = true,
  showDigitalTime = true
}) => {
  const [time, setTime] = useState(moment().tz(timezone));
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);
  const svgSize = size === 'small' ? 150 : size === 'large' ? 250 : 200;
  const clockRadius = svgSize / 2 - 10;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;

  // Get theme colors
  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          face: '#2c3e50',
          border: '#34495e',
          numbers: '#ecf0f1',
          hourHand: '#e74c3c',
          minuteHand: '#3498db',
          secondHand: '#2ecc71',
          center: '#f1c40f'
        };
      case 'colorful':
        return {
          face: '#f9f9f9',
          border: '#9b59b6',
          numbers: '#8e44ad',
          hourHand: '#e74c3c',
          minuteHand: '#3498db',
          secondHand: '#2ecc71',
          center: '#f1c40f'
        };
      case 'light':
      default:
        return {
          face: '#f9f9f9',
          border: '#4a6da7',
          numbers: '#333333',
          hourHand: '#333333',
          minuteHand: '#555555',
          secondHand: '#d9534f',
          center: '#333333'
        };
    }
  };

  const colors = getThemeColors();

  useEffect(() => {
    // Update time every second
    intervalRef.current = setInterval(() => {
      setTime(moment().tz(timezone));
    }, 1000);

    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timezone]);

  // Calculate rotation angles for clock hands
  const hours = time.hours() % 12;
  const minutes = time.minutes();
  const seconds = time.seconds();

  const hourDegrees = (hours * 30) + (minutes * 0.5); // 30 degrees per hour, plus small adjustment for minutes
  const minuteDegrees = minutes * 6; // 6 degrees per minute
  const secondDegrees = seconds * 6; // 6 degrees per second

  // Calculate hand coordinates
  const hourHandLength = clockRadius * 0.5;
  const minuteHandLength = clockRadius * 0.7;
  const secondHandLength = clockRadius * 0.8;

  // Convert degrees to radians and calculate end points
  const hourRadians = (hourDegrees - 90) * Math.PI / 180;
  const minuteRadians = (minuteDegrees - 90) * Math.PI / 180;
  const secondRadians = (secondDegrees - 90) * Math.PI / 180;

  const hourHandEnd = {
    x: centerX + hourHandLength * Math.cos(hourRadians),
    y: centerY + hourHandLength * Math.sin(hourRadians)
  };

  const minuteHandEnd = {
    x: centerX + minuteHandLength * Math.cos(minuteRadians),
    y: centerY + minuteHandLength * Math.sin(minuteRadians)
  };

  const secondHandEnd = {
    x: centerX + secondHandLength * Math.cos(secondRadians),
    y: centerY + secondHandLength * Math.sin(secondRadians)
  };

  // Generate hour markers
  const hourMarkers = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * Math.PI / 180;
    const innerRadius = clockRadius * 0.8;
    const outerRadius = clockRadius * 0.9;

    // For main hour markers (3, 6, 9, 12)
    const isMainMarker = i % 3 === 0;
    const markerInnerRadius = isMainMarker ? innerRadius - 5 : innerRadius;
    const markerOuterRadius = isMainMarker ? outerRadius + 5 : outerRadius;
    const markerWidth = isMainMarker ? 3 : 1;

    const x1 = centerX + markerInnerRadius * Math.cos(angle);
    const y1 = centerY + markerInnerRadius * Math.sin(angle);
    const x2 = centerX + markerOuterRadius * Math.cos(angle);
    const y2 = centerY + markerOuterRadius * Math.sin(angle);

    hourMarkers.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={colors.numbers}
        strokeWidth={markerWidth}
        strokeLinecap="round"
      />
    );

    // Add hour numbers
    if (isMainMarker) {
      const numberRadius = clockRadius * 0.7;
      const numX = centerX + numberRadius * Math.cos(angle);
      const numY = centerY + numberRadius * Math.sin(angle);
      const hourNum = i === 0 ? 12 : i / 3 * 3;

      hourMarkers.push(
        <text
          key={`num-${i}`}
          x={numX}
          y={numY}
          fill={colors.numbers}
          fontSize={svgSize / 15}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {hourNum}
        </text>
      );
    }
  }

  // Generate minute markers
  const minuteMarkers = [];
  for (let i = 0; i < 60; i++) {
    // Skip positions where hour markers are
    if (i % 5 === 0) continue;

    const angle = (i * 6 - 90) * Math.PI / 180;
    const innerRadius = clockRadius * 0.85;
    const outerRadius = clockRadius * 0.9;

    const x1 = centerX + innerRadius * Math.cos(angle);
    const y1 = centerY + innerRadius * Math.sin(angle);
    const x2 = centerX + outerRadius * Math.cos(angle);
    const y2 = centerY + outerRadius * Math.sin(angle);

    minuteMarkers.push(
      <line
        key={`min-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={colors.numbers}
        strokeWidth={0.5}
        strokeLinecap="round"
        opacity={0.5}
      />
    );
  }

  return (
    <div
      className={`analog-clock ${size} ${theme}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="clock-svg"
      >
        {/* Clock face */}
        <circle
          cx={centerX}
          cy={centerY}
          r={clockRadius}
          fill={colors.face}
          stroke={colors.border}
          strokeWidth="4"
          className="clock-face"
        />

        {/* Hour and minute markers */}
        {hourMarkers}
        {minuteMarkers}

        {/* Hour hand */}
        <line
          x1={centerX}
          y1={centerY}
          x2={hourHandEnd.x}
          y2={hourHandEnd.y}
          stroke={colors.hourHand}
          strokeWidth={svgSize / 30}
          strokeLinecap="round"
          className="hour-hand"
        />

        {/* Minute hand */}
        <line
          x1={centerX}
          y1={centerY}
          x2={minuteHandEnd.x}
          y2={minuteHandEnd.y}
          stroke={colors.minuteHand}
          strokeWidth={svgSize / 40}
          strokeLinecap="round"
          className="minute-hand"
        />

        {/* Second hand */}
        {showSeconds && (
          <line
            x1={centerX}
            y1={centerY}
            x2={secondHandEnd.x}
            y2={secondHandEnd.y}
            stroke={colors.secondHand}
            strokeWidth={svgSize / 80}
            strokeLinecap="round"
            className="second-hand"
          />
        )}

        {/* Center dot */}
        <circle
          cx={centerX}
          cy={centerY}
          r={svgSize / 30}
          fill={colors.center}
          className="clock-center"
        />
      </svg>

      {/* Clock info */}
      <div className={`clock-info ${isHovered ? 'hovered' : ''}`}>
        <div className="clock-label">{label}</div>
        {showDigitalTime && (
          <div className="clock-time">{time.format('HH:mm:ss')}</div>
        )}
      </div>
    </div>
  );
};

export default AnalogClock;
