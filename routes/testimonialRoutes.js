// FILE: backend/src/routes/testimonialRoutes.js


import express from 'express';
import { getTestimonials } from '../controllers/testimonialController.js';

const router = express.Router();

/**
 * GET /api/testimonials
 *  "This sign says 'Customer reviews are here!'"
 *  "Retrieves active testimonials with pagination support"
 */
router.get('/', getTestimonials);

export default router;