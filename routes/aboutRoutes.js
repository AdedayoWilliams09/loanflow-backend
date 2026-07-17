// FILE: backend/src/routes/aboutRoutes.js
// CREATED: New file

import express from 'express';
import { getAboutSettings, updateAboutSettings } from '../controllers/aboutController.js';

const router = express.Router();

/**
 * GET /api/settings/about
 *  "This sign says 'About page content is here!'"
 *  "Retrieves about page settings"
 */
router.get('/', getAboutSettings);

/**
 * PUT /api/settings/about
 *  "This sign says 'Update about page content!'"
 *  "Updates about page settings"
 */
router.put('/', updateAboutSettings);

export default router;