/**
 * Solar position calculation utilities
 * Based on NOAA's solar calculation algorithms
 * @see https://www.esrl.noaa.gov/gmd/grad/solcalc/
 */

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} - Angle in radians
 */
export const toRadians = (degrees) => {
  return degrees * Math.PI / 180;
};

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} - Angle in degrees
 */
export const toDegrees = (radians) => {
  return radians * 180 / Math.PI;
};

/**
 * Calculate the day of the year (0-365)
 * @param {Date} date - Date object
 * @returns {number} - Day of the year (0-365)
 */
export const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

/**
 * Calculate the Julian day from a Date object
 * @param {Date} date - Date object
 * @returns {number} - Julian day
 */
export const getJulianDay = (date) => {
  const time = date.getTime();
  const dayMs = 1000 * 60 * 60 * 24;
  return 2440587.5 + (time / dayMs);
};

/**
 * Calculate the Julian century
 * @param {number} julianDay - Julian day
 * @returns {number} - Julian century
 */
export const getJulianCentury = (julianDay) => {
  return (julianDay - 2451545) / 36525;
};

/**
 * Calculate the geometric mean longitude of the sun
 * @param {number} julianCentury - Julian century
 * @returns {number} - Geometric mean longitude of the sun in degrees
 */
export const getSunGeometricMeanLongitude = (julianCentury) => {
  let L0 = 280.46646 + julianCentury * (36000.76983 + julianCentury * 0.0003032);

  // Normalize to 0-360 degrees
  while (L0 > 360) {
    L0 -= 360;
  }
  while (L0 < 0) {
    L0 += 360;
  }

  return L0;
};

/**
 * Calculate the geometric mean anomaly of the sun
 * @param {number} julianCentury - Julian century
 * @returns {number} - Geometric mean anomaly of the sun in degrees
 */
export const getSunGeometricMeanAnomaly = (julianCentury) => {
  return 357.52911 + julianCentury * (35999.05029 - 0.0001537 * julianCentury);
};

/**
 * Calculate the eccentricity of earth's orbit
 * @param {number} julianCentury - Julian century
 * @returns {number} - Eccentricity of earth's orbit
 */
export const getEarthOrbitEccentricity = (julianCentury) => {
  return 0.016708634 - julianCentury * (0.000042037 + 0.0000001267 * julianCentury);
};

/**
 * Calculate the equation of center for the sun
 * @param {number} julianCentury - Julian century
 * @param {number} geometricMeanAnomaly - Geometric mean anomaly of the sun in degrees
 * @returns {number} - Equation of center for the sun in degrees
 */
export const getSunEquationOfCenter = (julianCentury, geometricMeanAnomaly) => {
  const M = geometricMeanAnomaly;
  const mrad = toRadians(M);

  return Math.sin(mrad) * (1.914602 - julianCentury * (0.004817 + 0.000014 * julianCentury))
    + Math.sin(2 * mrad) * (0.019993 - 0.000101 * julianCentury)
    + Math.sin(3 * mrad) * 0.000289;
};

/**
 * Calculate the true longitude of the sun
 * @param {number} geometricMeanLongitude - Geometric mean longitude of the sun in degrees
 * @param {number} equationOfCenter - Equation of center for the sun in degrees
 * @returns {number} - True longitude of the sun in degrees
 */
export const getSunTrueLongitude = (geometricMeanLongitude, equationOfCenter) => {
  return geometricMeanLongitude + equationOfCenter;
};

/**
 * Calculate the apparent longitude of the sun
 * @param {number} trueLongitude - True longitude of the sun in degrees
 * @param {number} julianCentury - Julian century
 * @returns {number} - Apparent longitude of the sun in degrees
 */
export const getSunApparentLongitude = (trueLongitude, julianCentury) => {
  return trueLongitude - 0.00569 - 0.00478 * Math.sin(toRadians(125.04 - 1934.136 * julianCentury));
};

/**
 * Calculate the declination of the sun
 * @param {number} apparentLongitude - Apparent longitude of the sun in degrees
 * @param {number} julianCentury - Julian century
 * @returns {number} - Declination of the sun in degrees
 */
export const getSunDeclination = (apparentLongitude, julianCentury) => {
  const obliqueCorrected = 23.439291 - julianCentury * (0.013004167 + julianCentury * (0.0000001639 + julianCentury * 0.0000005036));
  return toDegrees(Math.asin(Math.sin(toRadians(obliqueCorrected)) * Math.sin(toRadians(apparentLongitude))));
};

/**
 * Calculate the equation of time (in minutes)
 * @param {number} julianCentury - Julian century
 * @param {number} geometricMeanLongitude - Geometric mean longitude of the sun in degrees
 * @param {number} geometricMeanAnomaly - Geometric mean anomaly of the sun in degrees
 * @param {number} eccentricity - Eccentricity of earth's orbit
 * @returns {number} - Equation of time in minutes
 */
export const getEquationOfTime = (julianCentury, geometricMeanLongitude, geometricMeanAnomaly, eccentricity) => {
  const L0 = geometricMeanLongitude;
  const M = geometricMeanAnomaly;
  const e = eccentricity;

  let y = Math.tan(toRadians(23.439291 - julianCentury * (0.013004167 + julianCentury * (0.0000001639 + julianCentury * 0.0000005036))) / 2);
  y *= y;

  return 4 * toDegrees(
    y * Math.sin(2 * toRadians(L0))
    - 2 * e * Math.sin(toRadians(M))
    + 4 * e * y * Math.sin(toRadians(M)) * Math.cos(2 * toRadians(L0))
    - 0.5 * y * y * Math.sin(4 * toRadians(L0))
    - 1.25 * e * e * Math.sin(2 * toRadians(M))
  );
};

/**
 * Calculate the hour angle sunrise (in degrees)
 * @param {number} latitude - Latitude in degrees
 * @param {number} solarDeclination - Solar declination in degrees
 * @param {number} solarDepression - Solar depression for sunrise/sunset in degrees (default: 0.833)
 * @returns {number} - Hour angle sunrise in degrees
 */
export const getHourAngleSunrise = (latitude, solarDeclination, solarDepression = 0.833) => {
  const latRad = toRadians(latitude);
  const sdRad = toRadians(solarDeclination);
  const HAarg = (Math.cos(toRadians(90 + solarDepression)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));

  // Ensure the argument is in the valid range for acos
  const HAarg_constrained = Math.max(-1, Math.min(1, HAarg));

  return toDegrees(Math.acos(HAarg_constrained));
};

/**
 * Calculate the solar noon (in minutes from midnight)
 * @param {number} longitude - Longitude in degrees
 * @param {number} equationOfTime - Equation of time in minutes
 * @returns {number} - Solar noon in minutes from midnight
 */
export const getSolarNoon = (longitude, equationOfTime) => {
  return 720 - 4 * longitude - equationOfTime;
};

/**
 * Calculate the sunrise time (in minutes from midnight)
 * @param {number} solarNoon - Solar noon in minutes from midnight
 * @param {number} hourAngleSunrise - Hour angle sunrise in degrees
 * @returns {number} - Sunrise time in minutes from midnight
 */
export const getSunriseTime = (solarNoon, hourAngleSunrise) => {
  return solarNoon - hourAngleSunrise * 4;
};

/**
 * Calculate the sunset time (in minutes from midnight)
 * @param {number} solarNoon - Solar noon in minutes from midnight
 * @param {number} hourAngleSunrise - Hour angle sunrise in degrees
 * @returns {number} - Sunset time in minutes from midnight
 */
export const getSunsetTime = (solarNoon, hourAngleSunrise) => {
  return solarNoon + hourAngleSunrise * 4;
};

/**
 * Convert minutes from midnight to a Date object
 * @param {number} minutes - Minutes from midnight
 * @param {Date} date - Reference date
 * @returns {Date} - Date object
 */
export const minutesToDate = (minutes, date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setMinutes(minutes);
  return result;
};

/**
 * Calculate if a location is in daylight
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @param {Date} date - Date object (default: current date/time)
 * @returns {boolean} - True if the location is in daylight, false otherwise
 */
export const isLocationInDaylight = (latitude, longitude, date = new Date()) => {
  // Get Julian day and century
  const julianDay = getJulianDay(date);
  const julianCentury = getJulianCentury(julianDay);

  // Calculate solar position
  const geometricMeanLongitude = getSunGeometricMeanLongitude(julianCentury);
  const geometricMeanAnomaly = getSunGeometricMeanAnomaly(julianCentury);
  const eccentricity = getEarthOrbitEccentricity(julianCentury);
  const equationOfCenter = getSunEquationOfCenter(julianCentury, geometricMeanAnomaly);
  const trueLongitude = getSunTrueLongitude(geometricMeanLongitude, equationOfCenter);
  const apparentLongitude = getSunApparentLongitude(trueLongitude, julianCentury);
  const declination = getSunDeclination(apparentLongitude, julianCentury);
  const equationOfTime = getEquationOfTime(julianCentury, geometricMeanLongitude, geometricMeanAnomaly, eccentricity);

  // Calculate sunrise and sunset
  const hourAngleSunrise = getHourAngleSunrise(latitude, declination);
  const solarNoon = getSolarNoon(longitude, equationOfTime);
  const sunrise = getSunriseTime(solarNoon, hourAngleSunrise);
  const sunset = getSunsetTime(solarNoon, hourAngleSunrise);

  // Get current time in minutes from midnight
  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  // Check if current time is between sunrise and sunset
  return currentMinutes >= sunrise && currentMinutes <= sunset;
};

/**
 * Calculate the terminator coordinates (day/night boundary)
 * @param {Date} date - Date object (default: current date/time)
 * @param {number} resolution - Number of points to generate (default: 360)
 * @returns {Array} - Array of [longitude, latitude] coordinates for the terminator
 */
export const calculateTerminator = (date = new Date(), resolution = 360) => {
  // Get Julian day and century
  const julianDay = getJulianDay(date);
  const julianCentury = getJulianCentury(julianDay);

  // Calculate solar position
  const geometricMeanLongitude = getSunGeometricMeanLongitude(julianCentury);
  const geometricMeanAnomaly = getSunGeometricMeanAnomaly(julianCentury);
  const equationOfCenter = getSunEquationOfCenter(julianCentury, geometricMeanAnomaly);
  const trueLongitude = getSunTrueLongitude(geometricMeanLongitude, equationOfCenter);
  const apparentLongitude = getSunApparentLongitude(trueLongitude, julianCentury);
  const declination = getSunDeclination(apparentLongitude, julianCentury);

  // Calculate the terminator
  const terminatorPoints = [];

  // Calculate the subsolar point (where the sun is directly overhead)
  const subsolarLat = declination;

  // Calculate the subsolar longitude
  const equationOfTime = getEquationOfTime(
    julianCentury,
    geometricMeanLongitude,
    geometricMeanAnomaly,
    getEarthOrbitEccentricity(julianCentury)
  );

  const solarTime = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
  const subsolarLng = (solarTime - 720) / 4 - equationOfTime / 60;

  // Normalize the subsolar longitude to -180 to 180
  let normalizedSubsolarLng = subsolarLng;
  while (normalizedSubsolarLng > 180) normalizedSubsolarLng -= 360;
  while (normalizedSubsolarLng < -180) normalizedSubsolarLng += 360;

  // Generate points along the terminator
  // We'll use a higher resolution near the equator and lower near the poles
  const points = [];

  // First, calculate the antipode (opposite point) of the subsolar point
  const antiLat = -subsolarLat;
  let antiLng = normalizedSubsolarLng + 180;
  if (antiLng > 180) antiLng -= 360;

  // Generate points along the terminator (which is a great circle 90° from the subsolar point)
  for (let i = 0; i <= resolution; i++) {
    // Use a non-linear distribution to get more points near the equator
    const t = i / resolution;
    const angle = t * 360; // Angle around the great circle (0-360)

    // Convert to 3D coordinates (unit sphere)
    // Start with the subsolar point as the north pole
    const phi = toRadians(angle);
    const theta = toRadians(90); // 90 degrees from subsolar point

    // Calculate 3D coordinates
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    // Rotate the coordinates so the subsolar point is at its actual position
    // This is a simplified rotation - we're rotating around the axes
    const subsolarLatRad = toRadians(subsolarLat);
    const subsolarLngRad = toRadians(normalizedSubsolarLng);

    // Apply rotations (this is a simplified approximation)
    const x2 = x * Math.cos(subsolarLngRad) - y * Math.sin(subsolarLngRad);
    const y2 = x * Math.sin(subsolarLngRad) + y * Math.cos(subsolarLngRad);
    const z2 = z;

    const x3 = x2 * Math.cos(subsolarLatRad) + z2 * Math.sin(subsolarLatRad);
    const y3 = y2;
    const z3 = -x2 * Math.sin(subsolarLatRad) + z2 * Math.cos(subsolarLatRad);

    // Convert back to lat/lng
    let lat = toDegrees(Math.asin(z3));
    let lng = toDegrees(Math.atan2(y3, x3));

    // Handle edge cases and limit values
    if (isNaN(lat) || !isFinite(lat)) {
      lat = Math.sign(z3) * 89.9;
    }

    if (isNaN(lng) || !isFinite(lng)) {
      continue; // Skip this point
    }

    // Add the point
    points.push([lng, lat]);
  }

  // Sort points by longitude for proper rendering
  points.sort((a, b) => a[0] - b[0]);

  return points;
};

/**
 * Get the subsolar point (where the sun is directly overhead)
 * @param {Date} date - Date object (default: current date/time)
 * @returns {Object} - Object with latitude and longitude of the subsolar point
 */
export const getSubsolarPoint = (date = new Date()) => {
  // Get Julian day and century
  const julianDay = getJulianDay(date);
  const julianCentury = getJulianCentury(julianDay);

  // Calculate solar position
  const geometricMeanLongitude = getSunGeometricMeanLongitude(julianCentury);
  const geometricMeanAnomaly = getSunGeometricMeanAnomaly(julianCentury);
  const equationOfCenter = getSunEquationOfCenter(julianCentury, geometricMeanAnomaly);
  const trueLongitude = getSunTrueLongitude(geometricMeanLongitude, equationOfCenter);
  const apparentLongitude = getSunApparentLongitude(trueLongitude, julianCentury);
  const declination = getSunDeclination(apparentLongitude, julianCentury);

  // Calculate the subsolar point (where the sun is directly overhead)
  const subsolarLat = declination;

  // Calculate the subsolar longitude
  const equationOfTime = getEquationOfTime(
    julianCentury,
    geometricMeanLongitude,
    geometricMeanAnomaly,
    getEarthOrbitEccentricity(julianCentury)
  );

  const solarTime = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
  const subsolarLng = (solarTime - 720) / 4 - equationOfTime / 60;

  // Normalize longitude to -180 to 180
  let normalizedLng = subsolarLng;
  while (normalizedLng > 180) normalizedLng -= 360;
  while (normalizedLng < -180) normalizedLng += 360;

  return {
    latitude: subsolarLat,
    longitude: normalizedLng
  };
};
