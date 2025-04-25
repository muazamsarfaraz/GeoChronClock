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
      console.log('Creating night polygon with terminator points:', terminatorPoints.length);

      // Get the subsolar point to determine which side is in darkness
      const subsolarPoint = getSubsolarPoint(date);
      console.log('Subsolar point:', subsolarPoint);

      // Create a polygon that covers the night side of the Earth
      const nightCoordinates = [];

      // Determine which side of the terminator is in darkness using the subsolar point
      // The night side is opposite to the subsolar point
      const antipodeLng = subsolarPoint.longitude + 180;
      const antipodeLat = -subsolarPoint.latitude;

      // Sort terminator points by longitude
      const sortedTerminator = [...terminatorPoints].sort((a, b) => a[0] - b[0]);

      // Find the point on the terminator closest to the antipode
      const testPoint = sortedTerminator.reduce((closest, point) => {
        const distToAntipode = Math.abs(point[0] - antipodeLng);
        const distToClosest = Math.abs(closest[0] - antipodeLng);
        return distToAntipode < distToClosest ? point : closest;
      }, sortedTerminator[0]);

      // If the test point's latitude is closer to the antipode's latitude,
      // we need to reverse the terminator points
      const shouldReverse = Math.abs(testPoint[1] - antipodeLat) < 
                          Math.abs(testPoint[1] - subsolarPoint.latitude);

      const orderedTerminator = shouldReverse ? 
        sortedTerminator.reverse() : sortedTerminator;

      // Create the complete polygon
      // Start at the south pole on the western edge
      nightCoordinates.push([orderedTerminator[0][0], -90]);

      // Add all terminator points
      nightCoordinates.push(...orderedTerminator);

      // Complete the polygon by adding the eastern edge
      nightCoordinates.push([orderedTerminator[orderedTerminator.length-1][0], -90]);

      // Add points to wrap around the map edges if needed
      if (orderedTerminator[0][0] > -180) {
        nightCoordinates.push([-180, -90]);
        nightCoordinates.push([-180, 90]);
      }

      if (orderedTerminator[orderedTerminator.length-1][0] < 180) {
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
