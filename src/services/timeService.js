import moment from 'moment-timezone';
import { isLocationInDaylight } from '../utils/solarCalculations';

/**
 * Get the current time for a specific timezone
 * @param {string} timezone - The timezone to get the time for (e.g., 'America/New_York')
 * @returns {Object} - Object containing hours, minutes, seconds
 */
export const getCurrentTime = (timezone = 'UTC') => {
  const now = moment().tz(timezone);
  return {
    hours: now.hours(),
    minutes: now.minutes(),
    seconds: now.seconds(),
    formattedTime: now.format('HH:mm:ss'),
    timezone
  };
};

/**
 * Calculate if a location is in day or night based on its coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} - True if it's daytime, false if it's nighttime
 */
export const isDaytime = (lat, lng) => {
  return isLocationInDaylight(lat, lng);
};

/**
 * Get a list of major cities with their coordinates and current times
 * @returns {Array} - Array of city objects with name, coordinates, and time
 */
export const getMajorCities = () => {
  const cities = [
    { name: 'London', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
    { name: 'New York', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York' },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai' },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo' }
  ];

  return cities.map(city => ({
    ...city,
    time: getCurrentTime(city.timezone),
    isDaytime: isDaytime(city.lat, city.lng)
  }));
};

/**
 * Get a list of available timezones
 * @returns {Array} - Array of timezone objects with value and label
 */
export const getAvailableTimezones = () => {
  // Get current date for accurate offset calculation
  const now = moment();

  // Common timezones with their labels
  const timezones = [
    // UTC
    { value: 'UTC', label: 'UTC (GMT+0)' },

    // North America
    { value: 'America/New_York', label: 'New York' },
    { value: 'America/Chicago', label: 'Chicago' },
    { value: 'America/Denver', label: 'Denver' },
    { value: 'America/Los_Angeles', label: 'Los Angeles' },
    { value: 'America/Anchorage', label: 'Anchorage' },
    { value: 'America/Toronto', label: 'Toronto' },
    { value: 'America/Vancouver', label: 'Vancouver' },
    { value: 'America/Mexico_City', label: 'Mexico City' },

    // South America
    { value: 'America/Sao_Paulo', label: 'São Paulo' },
    { value: 'America/Buenos_Aires', label: 'Buenos Aires' },
    { value: 'America/Santiago', label: 'Santiago' },
    { value: 'America/Bogota', label: 'Bogota' },

    // Europe
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Europe/Berlin', label: 'Berlin' },
    { value: 'Europe/Madrid', label: 'Madrid' },
    { value: 'Europe/Rome', label: 'Rome' },
    { value: 'Europe/Moscow', label: 'Moscow' },
    { value: 'Europe/Istanbul', label: 'Istanbul' },

    // Asia
    { value: 'Asia/Dubai', label: 'Dubai' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Asia/Shanghai', label: 'Shanghai' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong' },
    { value: 'Asia/Singapore', label: 'Singapore' },
    { value: 'Asia/Seoul', label: 'Seoul' },
    { value: 'Asia/Kolkata', label: 'Mumbai/New Delhi' },
    { value: 'Asia/Bangkok', label: 'Bangkok' },
    { value: 'Asia/Jerusalem', label: 'Jerusalem' },

    // Oceania
    { value: 'Australia/Sydney', label: 'Sydney' },
    { value: 'Australia/Melbourne', label: 'Melbourne' },
    { value: 'Australia/Perth', label: 'Perth' },
    { value: 'Pacific/Auckland', label: 'Auckland' },

    // Africa
    { value: 'Africa/Cairo', label: 'Cairo' },
    { value: 'Africa/Johannesburg', label: 'Johannesburg' },
    { value: 'Africa/Lagos', label: 'Lagos' },
    { value: 'Africa/Nairobi', label: 'Nairobi' }
  ];

  // Add GMT offset to each timezone label
  return timezones.map(tz => {
    // Skip UTC as it already has the offset in the label
    if (tz.value === 'UTC') return tz;

    // Calculate the GMT offset for this timezone
    const offset = moment.tz(now, tz.value).format('Z');

    // Add the offset to the label
    return {
      ...tz,
      label: `${tz.label} (GMT${offset})`
    };
  });
};
