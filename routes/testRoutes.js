// FILE: backend/routes/testRoutes.js


import express from 'express';
import { testConnection } from '../controllers/testController.js';
import { query } from 'express-validator';

const router = express.Router();

/**
 * Test Connection Route
 * GET /api/test
 * 
 *  Child Explanation:
 * "This is like a practice phone call to make sure our kitchen phone is working.
 * If someone tries to send extra information we don't want, we politely say
 * 'Sorry, we don't need that information right now.'"
 * 
 *  Technical Explanation:
 * "This endpoint tests the API connection. It uses express-validator to
 * validate query parameters, rejecting any unexpected parameters as a security
 * measure to prevent injection attacks and ensure only expected input is
 * processed."
 */
router.get('/', [
  // Validate query parameters - reject any unexpected ones
  query().custom((value, { req }) => {
    const allowedParams = []; // No query params allowed
    const receivedParams = Object.keys(req.query);
    const invalidParams = receivedParams.filter(p => !allowedParams.includes(p));
    
    if (invalidParams.length > 0) {
      throw new Error(`Unexpected query parameters: ${invalidParams.join(', ')}`);
    }
    return true;
  })
], testConnection);

export default router;