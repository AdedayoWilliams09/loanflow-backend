


import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Authentication Middleware
 * 
 *  Child Explanation:
 * "This is the security guard that checks if you have a valid pass to enter."
 * 
 *  Technical Explanation:
 * "Verifies JWT token from Authorization header and attaches user to request."
 */
export const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - No token provided',
        timestamp: new Date().toISOString(),
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - User not found',
        timestamp: new Date().toISOString(),
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
        timestamp: new Date().toISOString(),
      });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Invalid token',
        timestamp: new Date().toISOString(),
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Token expired',
        timestamp: new Date().toISOString(),
      });
    }
    
    next(error);
  }
};

/**
 * Authorization Middleware
 * 
 *  Child Explanation:
 * "This checks if you have the right role to access certain areas."
 * 
 *  Technical Explanation:
 * "Restricts access to users with specific roles."
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - User not authenticated',
        timestamp: new Date().toISOString(),
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied - ${req.user.role} role does not have permission`,
        timestamp: new Date().toISOString(),
      });
    }
    
    next();
  };
};