// FILE: backend/routes/healthRoutes.js


import express from 'express';
import { healthCheck } from '../controllers/healthController.js';

const router = express.Router();

/**
 * Health Check Route
 * GET /api/health
 * 
 *  Child Explanation:
 * "This is like asking 'Are you open?' The kitchen always says 'Yes, I'm open!'
 * and tells you how long it's been open and if the phone line to the database
 * is working."
 * 
 *  Technical Explanation:
 * "This endpoint provides a lightweight health check for monitoring tools,
 * load balancers, and the frontend. It returns the service status, uptime,
 * and database connection status without performing heavy operations."
 */
router.get('/', healthCheck);

export default router;