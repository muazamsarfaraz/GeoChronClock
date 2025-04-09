# GeoChron Clock

A single-page web application that visually represents global time zones and day/night cycles on a world map, along with multiple optional analog clocks for selected time zones.

## Overview

The GeoChron Clock provides users with a clear, real-time view of major city time zones (London, New York, Dubai, Japan) and enables them to manage and persistently save additional custom clocks. It solves the problem of quickly referencing different world times in a single, intuitive interface, particularly useful for users who coordinate meetings or events across multiple time zones.

## Core Features

1. **GeoChron Display**: Shows a world map with a dynamic day/night gradient. Major cities (London, New York, Dubai, Japan) are pinned with current local times.

2. **Custom Analog Clocks**: Allows users to add multiple analog clocks below the GeoChron. They can pick any timezone from a dropdown, and each clock will show that time zone's local time.

3. **Persistent Configuration**: Saves the user's chosen custom clocks and loads them automatically on subsequent visits.

## Technical Architecture

- **Frontend**: Single Page Application built with React
- **Backend**: Minimal Node.js/Express service for configuration persistence
- **Time Zone Handling**: Uses moment-timezone for accurate time calculations

## Development

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies: `npm install` or `yarn install`
3. Start development server: `npm run dev` or `yarn dev`

## Project Structure

```
/
├── src/                  # Source code
│   ├── components/       # React components
│   ├── services/         # API and service functions
│   ├── assets/           # Static assets (images, fonts, etc.)
│   ├── utils/            # Utility functions
│   └── backend/          # Backend code for persistence
├── public/               # Public static files
└── ...
```

## License

[License information]
