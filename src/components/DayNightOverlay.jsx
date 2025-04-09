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
    try {
      console.log('Initializing day/night overlay...');

      if (!map) {
        console.error('Map instance is undefined in DayNightOverlay');
        return;
      }

      // Create the day/night overlay
      const createDayNightOverlay = () => {
        try {
          // Remove any existing overlay
          if (overlay) {
            try {
              overlay.remove();
            } catch (error) {
              console.warn('Error removing existing overlay:', error);
            }
          }

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
        } catch (error) {
          console.error('Error creating day/night overlay:', error);
        }
      };

      createDayNightOverlay();

      // Set up animation loop for smooth updates
      const animate = (time) => {
        try {
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
        } catch (error) {
          console.error('Error in animation frame:', error);
        }
      };

      requestRef.current = requestAnimationFrame(animate);

      // Cleanup function
      return () => {
        console.log('Cleaning up day/night overlay...');

        if (overlay) {
          try {
            overlay.remove();
          } catch (error) {
            console.warn('Error removing overlay during cleanup:', error);
          }
        }

        if (requestRef.current) {
          try {
            cancelAnimationFrame(requestRef.current);
          } catch (error) {
            console.warn('Error canceling animation frame:', error);
          }
        }
      };
    } catch (error) {
      console.error('Error in DayNightOverlay effect:', error);
    }
  }, [map, date, overlay]);

  // Create a polygon for the night side
  const createNightPolygon = (terminatorPoints) => {
    try {
      console.log('Creating night polygon with terminator points:', terminatorPoints.length);

      // Get the subsolar point to determine which side is in darkness
      const subsolarPoint = getSubsolarPoint(date);
      console.log('Subsolar point:', subsolarPoint);

      // Create a polygon that covers the night side of the Earth
      const nightCoordinates = [];

      // First, determine which side of the terminator is in darkness
      // We'll use the subsolar point as a reference
      const testPoint = [-subsolarPoint.longitude, 0]; // Point opposite to subsolar point

      // Add the terminator points (the day/night boundary)
      // We need to ensure they're in the correct order
      const sortedTerminator = [...terminatorPoints].sort((a, b) => a[0] - b[0]);

      // Create a complete polygon by adding points at the poles
      // This creates a closed shape that covers the night side
      nightCoordinates.push([sortedTerminator[0][0], -90]); // South pole at western edge

      // Add all terminator points
      nightCoordinates.push(...sortedTerminator);

      // Complete the polygon by adding the eastern edge and back to start
      nightCoordinates.push([sortedTerminator[sortedTerminator.length-1][0], -90]); // South pole at eastern edge

      // Add points to wrap around the map edges if needed
      if (sortedTerminator[0][0] > -180) {
        nightCoordinates.push([-180, -90]); // Bottom left
        nightCoordinates.push([-180, 90]);  // Top left
      }

      if (sortedTerminator[sortedTerminator.length-1][0] < 180) {
        nightCoordinates.push([180, 90]);  // Top right
        nightCoordinates.push([180, -90]); // Bottom right
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
    } catch (error) {
      console.error('Error creating night polygon:', error);
      // Return a fallback polygon if there's an error
      return L.polygon([[-180, -90], [-180, 90], [180, 90], [180, -90]], {
        color: '#001a33',
        weight: 0,
        fillColor: '#001a33',
        fillOpacity: 0.3,
        className: 'night-overlay-fallback'
      });
    }
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
