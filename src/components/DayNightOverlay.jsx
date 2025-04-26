import { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { calculateTerminator, getSubsolarPoint } from '../utils/solarCalculations';
import './DayNightOverlay.css';

const DayNightOverlay = ({ date = new Date() }) => {
  const map = useMap();
  const [overlay, setOverlay] = useState(null);
  const intervalRef = useRef(null);
  const overlayRef = useRef(null);

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
          if (overlayRef.current) {
            try {
              overlayRef.current.remove();
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
          overlayRef.current = newOverlay;
          setOverlay(newOverlay);
        } catch (error) {
          console.error('Error creating day/night overlay:', error);
        }
      };

      // Initial creation
      createDayNightOverlay();

      // Set up interval for updates (every minute)
      intervalRef.current = setInterval(() => {
        createDayNightOverlay();
      }, 60000);

      // Cleanup function
      return () => {
        console.log('Cleaning up day/night overlay...');

        // Clear the update interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Remove the overlay
        if (overlayRef.current) {
          try {
            overlayRef.current.remove();
            overlayRef.current = null;
          } catch (error) {
            console.warn('Error removing overlay during cleanup:', error);
          }
        }
      };
    } catch (error) {
      console.error('Error in DayNightOverlay effect:', error);
    }
  }, [map, date]);

  // Create a polygon for the night side
  const createNightPolygon = (terminatorPoints) => {
    try {
      // Get the subsolar point to determine which side is in darkness
      const subsolarPoint = getSubsolarPoint(date);

      // Sort terminator points by longitude
      const sortedTerminator = [...terminatorPoints].sort((a, b) => a[0] - b[0]);

      // The night side is always the hemisphere opposite the subsolar point
      // We'll construct the polygon by starting at the south pole at the westernmost longitude,
      // tracing the terminator, and ending at the south pole at the easternmost longitude.
      const nightCoordinates = [];
      // Start at south pole, westernmost longitude
      nightCoordinates.push([sortedTerminator[0][0], -90]);
      // Trace the terminator
      nightCoordinates.push(...sortedTerminator);
      // End at south pole, easternmost longitude
      nightCoordinates.push([sortedTerminator[sortedTerminator.length - 1][0], -90]);

      // Optionally, close the polygon along the map edges if needed
      if (sortedTerminator[0][0] > -180) {
        nightCoordinates.push([-180, -90]);
        nightCoordinates.push([-180, 90]);
      }
      if (sortedTerminator[sortedTerminator.length - 1][0] < 180) {
        nightCoordinates.push([180, 90]);
        nightCoordinates.push([180, -90]);
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
