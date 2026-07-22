// FILE: backend/routes/authRoutes.js

import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { 
  login, 
  refreshToken, 
  logout, 
  getMe 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * Strict Auth Limiter attached inside route stack
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
});

/**
 * Validation rules
 */
const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .bail()
    .trim()
    .toLowerCase(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  body('rememberMe')
    .optional()
    .isBoolean().withMessage('Remember me must be a boolean'),
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required'),
];

/**
 * POST /api/auth/login
 */
router.post('/login', authLimiter, loginValidation, login);

/**
 * POST /api/auth/refresh
 */
router.post('/refresh', refreshTokenValidation, refreshToken);

/**
 * POST /api/auth/logout
 */
router.post('/logout', logout);

/**
 * GET /api/auth/me
 */
router.get('/me', protect, getMe);

/**
 * GET /api/auth/google
 */
router.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false,
  })
);

/**
 * GET /api/auth/google/callback
 */
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      console.error('OAuth Auth Error:', err || info);
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`);
    }

    try {
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/oauth-callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (tokenError) {
      console.error('Token generation failed:', tokenError);
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=token_generation_failed`);
    }
  })(req, res, next);
});

export default router;