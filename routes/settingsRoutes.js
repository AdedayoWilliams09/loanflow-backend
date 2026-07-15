// FILE: backend/src/routes/settingsRoutes.js


import express from 'express';
import { 
  getSettings, 
  getStatistics, 
  getHeroContent,
  getFeatures 
} from '../controllers/settingsController.js';

const router = express.Router();

/**
 * GET /api/settings/statistics
 *  "This sign says 'Impressive numbers are here!'"
 *  "Retrieves trust statistics"
 */
router.get('/statistics', getStatistics);

/**
 * GET /api/settings/hero
 *  "This sign says 'Welcome message is here!'"
 *  "Retrieves hero section content"
 */
router.get('/hero', getHeroContent);

/**
 * GET /api/settings/features
 * "This sign says 'Special features are here!'"
 *  "Retrieves feature cards"
 */
router.get('/features', getFeatures);

/**
 * GET /api/settings/:key?
 *  "This sign says 'Settings are here!'"
 *  "Retrieves settings by key or all settings"
 */
router.get('/:key', getSettings);

export default router;