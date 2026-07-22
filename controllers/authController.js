
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { validationResult } from 'express-validator';

/**
 * Login Controller
 * 
 *  Child Explanation:
 * "This chef checks your email and password and lets you in if they're correct."
 * 
 *  Technical Explanation:
 * "Handles user login with email and password validation."
 */
export const login = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path || err.param,
          message: err.msg,
        })),
        timestamp: new Date().toISOString(),
      });
    }

    const { email, password, rememberMe } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
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

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Account is locked due to too many failed attempts. Please try again later.',
        timestamp: new Date().toISOString(),
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      // Lock account after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }
      
      await user.save();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        timestamp: new Date().toISOString(),
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: user.getPublicProfile(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh Token Controller
 * 
 *  Child Explanation:
 * "This chef gives you a new pass when your old one expires."
 * 
 *  Technical Explanation:
 * "Generates a new access token using a refresh token."
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
        timestamp: new Date().toISOString(),
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        timestamp: new Date().toISOString(),
      });
    }

    // Generate new access token
    const accessToken = user.generateAccessToken();
    
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        timestamp: new Date().toISOString(),
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired. Please login again.',
        timestamp: new Date().toISOString(),
      });
    }
    
    next(error);
  }
};

/**
 * Logout Controller
 * 
 *  Child Explanation:
 * "This chef lets you leave and forgets your pass."
 * 
 *  Technical Explanation:
 * "Handles logout (client-side token removal)."
 */
export const logout = async (req, res, next) => {
  try {
    // Since we're using JWT, logout is handled on client side
    // We just send a success response
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current User
 * 
 *  Child Explanation:
 * "This chef tells you who you are."
 * 
 *  Technical Explanation:
 * "Returns the current authenticated user's profile."
 */
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user: req.user.getPublicProfile(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};