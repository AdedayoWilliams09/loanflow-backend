// FILE: backend/src/routes/contactRoutes.js


import express from 'express';
import { body } from 'express-validator';
import { submitContactForm, getContactSubmissions } from '../controllers/contactController.js';

const router = express.Router();

/**
 * POST /api/contact
 *  "This sign says 'Send a message here!'"
 *  "Submits a contact form with validation"
 */
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .isMobilePhone().withMessage('Please provide a valid phone number'),
    body('subject')
      .trim()
      .notEmpty().withMessage('Subject is required')
      .isIn(['General Inquiry', 'Loan Application Support', 'Repayment Help', 'Feedback', 'Complaint', 'Other'])
      .withMessage('Invalid subject selected'),
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required')
      .isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
      .isLength({ max: 5000 }).withMessage('Message cannot exceed 5000 characters'),
  ],
  submitContactForm
);

/**
 * GET /api/contact/submissions
 * 🧒 "This sign says 'View all messages' (admin only - coming soon)"
 * 👨‍💻 "Retrieves contact submissions with pagination (admin only - placeholder for Phase 5)"
 */
// COMMENTED OUT - Will be enabled when authentication is implemented in Phase 6
// router.get('/submissions', protect, authorize('admin'), getContactSubmissions);

// For now, we'll add a placeholder route that returns a message
router.get('/submissions', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin panel coming in Phase 5. Authentication will be implemented in Phase 6.',
    data: [],
    timestamp: new Date().toISOString(),
  });
});

export default router;