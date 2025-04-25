# GeoChronClock

A global time visualization tool that displays a world map with day/night gradient, major city time pins, and customizable analog clocks for different time zones.

## Features

- **Interactive World Map**: View a world map with a real-time day/night gradient overlay
- **Major City Time Pins**: See the current time in major cities around the world
- **Custom Analog Clocks**: Add and remove analog clocks for any time zone
- **Time Zone Selection**: Choose from a comprehensive list of time zones
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Configuration Persistence**: Your custom clocks are saved between sessions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/muazamsarfaraz/GeoChronClock.git
   cd GeoChronClock
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage Guide

### World Map with Day/Night Gradient

The main map displays the current day/night gradient across the world. The illuminated areas represent daytime, while the darker areas represent nighttime. The gradient updates in real-time.

### Major City Time Pins

The map displays pins for major cities (London, New York, Dubai, and Tokyo) with their current local times. Click on a pin to see more details about the city's time.

### Adding Custom Clocks

1. Use the time zone selector below the map to choose a time zone
2. Click the "Add Clock" button to add an analog clock for that time zone
3. Your custom clocks will appear in the clocks section

### Managing Custom Clocks

- **Remove a Clock**: Hover over a clock and click the "X" button
- **View Different Layouts**: Use the grid/carousel buttons to change the clock display layout
- **Clock Themes**: Clocks are displayed with different themes for visual variety

## Architecture

### Frontend

- React.js for the UI components
- Leaflet.js for the interactive map
- Moment.js and Moment Timezone for time calculations
- CSS for styling and animations

### Backend

- Node.js with Express for the API server
- MongoDB for configuration storage (with in-memory fallback)

### Key Components

- `GeoChronMap`: Main map component with day/night overlay
- `DayNightOverlay`: Calculates and displays the day/night gradient
- `AnalogClock`: Customizable analog clock component
- `ClockCollection`: Manages multiple analog clocks
- `TimeZoneSelector`: Interface for selecting time zones
- `NotificationManager`: Handles user notifications

## Deployment

### Live Deployment

The application is currently deployed and accessible at: https://geochronclock-production.up.railway.app/

### Building for Production

```
npm run build
```

### Deploying the Frontend

The frontend can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Deploying the Backend

The backend API can be deployed to:

- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- DigitalOcean App Platform
- Railway (current platform)