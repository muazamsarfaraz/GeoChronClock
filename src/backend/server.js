import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import configRoutes from './routes/configRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (optional for MVP)
connectDB().catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GeoChron Clock API is running' });
});

// API routes
app.use('/api', configRoutes);

// Serve static assets
// Set static folder
app.use(express.static(join(__dirname, '../../dist')));

// Any route that is not an API route should serve the index.html
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api')) {
    const indexPath = join(__dirname, '../../dist/index.html');
    console.log(`Attempting to serve index.html from: ${indexPath}`);

    // Check if the file exists
    if (fs.existsSync(indexPath)) {
      console.log('index.html file found, serving...');
      res.sendFile(indexPath);
    } else {
      console.error('index.html file not found!');
      res.status(404).send('index.html not found. Make sure the build was successful.');
    }
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/health`);
});
