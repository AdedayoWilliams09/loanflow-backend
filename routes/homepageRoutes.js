// FILE: backend/src/routes/homepageRoutes.js

import express from 'express';
import { getHomepageData } from '../controllers/homepageController.js';

const router = express.Router();

router.get('/homepage', getHomepageData);

export default router;