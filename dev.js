#!/usr/bin/env node

/**
 * Development script to run both frontend and backend servers
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.development
const envPath = join(__dirname, '.env.development');
if (fs.existsSync(envPath)) {
  console.log('Loading environment variables from .env.development');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = envContent
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.split('=').map(part => part.trim()));
  
  for (const [key, value] of envVars) {
    if (key && value) {
      process.env[key] = value;
    }
  }
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  frontend: '\x1b[36m', // Cyan
  backend: '\x1b[32m',  // Green
  error: '\x1b[31m',    // Red
};

// Function to create a prefixed logger
const createLogger = (prefix, color) => {
  return (data) => {
    const lines = data.toString().trim().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${color}[${prefix}]${colors.reset} ${line}`);
      }
    }
  };
};

// Start the frontend development server
const startFrontend = () => {
  console.log(`${colors.frontend}[Frontend]${colors.reset} Starting Vite development server...`);
  
  const frontend = spawn('npx', ['vite'], {
    stdio: 'pipe',
    shell: true,
  });
  
  frontend.stdout.on('data', createLogger('Frontend', colors.frontend));
  frontend.stderr.on('data', createLogger('Frontend Error', colors.error));
  
  frontend.on('close', (code) => {
    console.log(`${colors.frontend}[Frontend]${colors.reset} Process exited with code ${code}`);
  });
  
  return frontend;
};

// Start the backend server
const startBackend = () => {
  console.log(`${colors.backend}[Backend]${colors.reset} Starting Express server...`);
  
  const backend = spawn('node', ['src/backend/server.js'], {
    stdio: 'pipe',
    shell: true,
  });
  
  backend.stdout.on('data', createLogger('Backend', colors.backend));
  backend.stderr.on('data', createLogger('Backend Error', colors.error));
  
  backend.on('close', (code) => {
    console.log(`${colors.backend}[Backend]${colors.reset} Process exited with code ${code}`);
  });
  
  return backend;
};

// Start both servers
const frontend = startFrontend();
const backend = startBackend();

// Handle process termination
const cleanup = () => {
  console.log('\nShutting down servers...');
  
  if (frontend) {
    frontend.kill();
  }
  
  if (backend) {
    backend.kill();
  }
  
  process.exit(0);
};

// Listen for termination signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
