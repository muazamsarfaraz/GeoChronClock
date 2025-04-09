import express from 'express';
import { saveUserConfig, getUserConfig } from '../controllers/configController.js';

const router = express.Router();

// Routes for user configuration
router.post('/save-configuration', saveUserConfig);
router.get('/load-configuration', getUserConfig);

export default router;
