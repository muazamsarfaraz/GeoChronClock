import { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { calculateTerminator, getSubsolarPoint } from '../utils/solarCalculations';
import './DayNightOverlay.css';

const DayNightOverlay = ({ date = new Date() }) => {
  const map = useMap();
  const [overlay, setOverlay] = useState(null);
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);

  useEffect(() => {
    // Remove any existing overlay
    if (overlay) {
      overlay.remove();
    }

    // Create the day/night overlay
    const createDayNightOverlay = () => {
      // Calculate the terminator (day/night boundary)
      const terminatorPoints = calculateTerminator(date, 720); // Higher resolution for smoother curve

      // Get the subsolar point (where the sun is directly overhead)
      const subsolarPoint = getSubsolarPoint(date);

      // Create a polygon for the night side
      const nightPolygon = createNightPolygon(terminatorPoints);

      // Create a circle for the subsolar point
      const subsolarMarker = createSubsolarMarker(subsolarPoint);

      // Create the terminator line
      const terminatorLine = createTerminatorLine(terminatorPoints);

      // Create a layer group for the overlay
      const newOverlay = L.layerGroup([nightPolygon, terminatorLine, subsolarMarker]);

      // Add the overlay to the map
      newOverlay.addTo(map);

      // Save the overlay for later removal
      setOverlay(newOverlay);
    };

    createDayNightOverlay();

    // Set up animation loop for smooth updates
    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;

        // Update every 60 seconds (or when date prop changes)
        if (deltaTime > 60000) {
          createDayNightOverlay();
          previousTimeRef.current = time;
        }
      } else {
        previousTimeRef.current = time;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (overlay) {
        overlay.remove();
      }

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [map, date]);

  // Create a polygon for the night side
  const createNightPolygon = (terminatorPoints) => {
    // Create a polygon that covers the night side of the Earth
    const nightCoordinates = [...terminatorPoints];

    // Add points along the edges of the map to complete the polygon
    // This depends on which side of the Earth is in darkness
    const firstPoint = terminatorPoints[0];
    const lastPoint = terminatorPoints[terminatorPoints.length - 1];

    // Calculate the average longitude of the terminator points
    const sumLongitudes = terminatorPoints.reduce((sum, point) => sum + point[0], 0);
    const avgLongitude = sumLongitudes / terminatorPoints.length;

    // Determine which side of the Earth is in darkness based on the average longitude
    // If average longitude is positive, the western hemisphere is in darkness
    // If average longitude is negative, the eastern hemisphere is in darkness
    const isWesternHemisphereDark = avgLongitude > 0;

    if (isWesternHemisphereDark) {
      // Add points to cover the western hemisphere
      nightCoordinates.push([-180, -90]); // Bottom left
      nightCoordinates.push([-180, 90]);  // Top left
    } else {
      // Add points to cover the eastern hemisphere
      nightCoordinates.push([180, -90]);  // Bottom right
      nightCoordinates.push([180, 90]);   // Top right
    }

    // Create the polygon with a gradient fill
    const nightPolygon = L.polygon(nightCoordinates, {
      color: '#001a33',
      weight: 0,
      fillColor: '#001a33',
      fillOpacity: 0.6,
      className: 'night-overlay'
    });

    return nightPolygon;
  };

  // Create a line for the terminator (day/night boundary)
  const createTerminatorLine = (terminatorPoints) => {
    // Create a polyline for the terminator
    const terminatorLine = L.polyline(terminatorPoints, {
      color: '#ffcc00',
      weight: 1,
      opacity: 0.5,
      dashArray: '5, 5',
      className: 'terminator-line'
    });

    // Add a tooltip
    terminatorLine.bindTooltip('Day/Night Boundary (Terminator)', {
      permanent: false,
      direction: 'center',
      className: 'terminator-tooltip'
    });

    return terminatorLine;
  };

  // Create a marker for the subsolar point
  const createSubsolarMarker = (subsolarPoint) => {
    // Create a circle marker at the subsolar point
    const marker = L.circleMarker([subsolarPoint.latitude, subsolarPoint.longitude], {
      radius: 5,
      color: '#ffcc00',
      fillColor: '#ffcc00',
      fillOpacity: 1,
      weight: 2,
      className: 'subsolar-point'
    });

    // Add a tooltip
    marker.bindTooltip('Subsolar Point (Sun directly overhead)', {
      permanent: false,
      direction: 'top',
      className: 'subsolar-tooltip'
    });

    return marker;
  };

  return null; // This component doesn't render anything directly
};

export default DayNightOverlay;
