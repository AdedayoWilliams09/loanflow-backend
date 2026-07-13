// FILE: backend/controllers/testController.js


import { validationResult } from 'express-validator';

/**
 * Test Connection Controller
 * 
 *  Child Explanation:
 * "This chef's job is to make a practice meal to show that the kitchen is working.
 * If there are any problems with the order, they catch them before cooking."
 * 
 *  Technical Explanation:
 * "This controller tests the API connection. It validates that no unexpected
 * query parameters were sent, then returns a success response with system
 * information. This is useful for frontend-backend connectivity testing."
 */
export const testConnection = (req, res) => {
  // Check for validation errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If validation failed, return a 400 Bad Request
    return res.status(400).json({
      success: false,
      message: 'Invalid query parameters',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
      timestamp: new Date().toISOString(),
    });
  }
  
  // Prepare test response
  const response = {
    success: true,
    message: 'API connection successful',
    data: {
      backendStatus: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      apiVersion: '1.0.0',
    },
  };
  
  res.status(200).json(response);
};