#!/bin/bash

# GeoChronClock Deployment Script

# Configuration
FRONTEND_BUILD_DIR="build"
BACKEND_DIR="server"
ENV_FILE=".env"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
  echo -e "${GREEN}==>${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}WARNING:${NC} $1"
}

print_error() {
  echo -e "${RED}ERROR:${NC} $1"
}

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
  print_warning "Environment file not found. Creating a sample .env file."
  echo "# GeoChronClock Environment Variables" > $ENV_FILE
  echo "PORT=3001" >> $ENV_FILE
  echo "MONGODB_URI=mongodb://localhost:27017/geochron" >> $ENV_FILE
  echo "NODE_ENV=production" >> $ENV_FILE
fi

# Step 1: Install dependencies
print_step "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
  print_error "Failed to install dependencies."
  exit 1
fi

# Step 2: Run tests
print_step "Running tests..."
npm test -- --watchAll=false
if [ $? -ne 0 ]; then
  print_error "Tests failed. Deployment aborted."
  exit 1
fi

# Step 3: Build frontend
print_step "Building frontend..."
npm run build
if [ $? -ne 0 ]; then
  print_error "Frontend build failed."
  exit 1
fi

# Step 4: Check if backend directory exists
if [ -d "$BACKEND_DIR" ]; then
  print_step "Installing backend dependencies..."
  (cd $BACKEND_DIR && npm install --production)
  if [ $? -ne 0 ]; then
    print_error "Failed to install backend dependencies."
    exit 1
  fi
else
  print_warning "Backend directory not found. Skipping backend deployment."
fi

# Step 5: Prepare for deployment
print_step "Preparing for deployment..."

# Create a deployment package
DEPLOY_DIR="deploy"
mkdir -p $DEPLOY_DIR

# Copy frontend build
cp -r $FRONTEND_BUILD_DIR $DEPLOY_DIR/public

# Copy backend files if they exist
if [ -d "$BACKEND_DIR" ]; then
  mkdir -p $DEPLOY_DIR/server
  cp -r $BACKEND_DIR/package.json $BACKEND_DIR/package-lock.json $BACKEND_DIR/node_modules $BACKEND_DIR/src $DEPLOY_DIR/server/
  cp $ENV_FILE $DEPLOY_DIR/
fi

# Create a simple server.js file if backend doesn't exist
if [ ! -d "$BACKEND_DIR" ]; then
  print_warning "Creating a simple Express server for static file serving."
  mkdir -p $DEPLOY_DIR/server
  cat > $DEPLOY_DIR/server/server.js << 'EOL'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../public')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`GeoChronClock server is running on port ${PORT}`);
});
EOL

  # Create a package.json for the simple server
  cat > $DEPLOY_DIR/server/package.json << 'EOL'
{
  "name": "geochron-clock-server",
  "version": "1.0.0",
  "description": "Simple server for GeoChronClock",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  }
}
EOL

  # Install dependencies for the simple server
  (cd $DEPLOY_DIR/server && npm install --production)
fi

# Create a start script
cat > $DEPLOY_DIR/start.sh << 'EOL'
#!/bin/bash
cd server
npm start
EOL
chmod +x $DEPLOY_DIR/start.sh

# Create a README for deployment
cat > $DEPLOY_DIR/README.md << 'EOL'
# GeoChronClock Deployment Package

This package contains the built GeoChronClock application ready for deployment.

## Structure
- `public/` - The built frontend application
- `server/` - The backend server
- `.env` - Environment configuration (if present)
- `start.sh` - Script to start the application

## Deployment Instructions

1. Copy this entire directory to your server
2. Configure the `.env` file with your production settings
3. Run `./start.sh` to start the application
4. The application will be available on the port specified in your `.env` file (default: 3000)

## Requirements
- Node.js 14.x or higher
- npm 6.x or higher
- MongoDB (if using the full backend)
EOL

print_step "Deployment package created in the '$DEPLOY_DIR' directory."
print_step "To deploy, copy the '$DEPLOY_DIR' directory to your server and run './start.sh'."
print_step "Deployment preparation completed successfully!"
