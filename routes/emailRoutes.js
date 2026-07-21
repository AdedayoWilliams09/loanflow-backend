// FILE: backend/src/routes/emailRoutes.js
import express from 'express';
import { sendTestEmail } from '../services/emailService.js';

const router = express.Router();

/**
 * @route   POST /api/email/test
 * @desc    Send a test email to verify configuration
 * @access  Public / Admin
 */
router.post('/test', async (req, res, next) => {
  try {
    const { to } = req.body;
    await sendTestEmail(to);

    return res.status(200).json({
      success: true,
      message: `Test email sent successfully${to ? ` to ${to}` : ''}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;