// FILE: backend/src/routes/faqRoutes.js
// CREATED: New file

import express from 'express';
import { getFAQs } from '../controllers/faqController.js';

const router = express.Router();

/**
 * GET /api/faqs
 *  "This sign says 'Questions and answers are here!'"
 *  "Retrieves active FAQs with optional category filtering"
 */
router.get('/', getFAQs);

export default router;