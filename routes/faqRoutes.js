// FILE: backend/src/routes/faqRoutes.js
// CREATED: New file

import express from 'express';
import { getFAQs, getFAQCategories } from '../controllers/faqController.js';

const router = express.Router();

router.get('/categories', getFAQCategories);

router.get('/', getFAQs);

export default router;