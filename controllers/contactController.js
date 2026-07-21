// FILE: backend/src/controllers/contactController.js


import { ContactSubmission } from '../models/ContactSubmission.js';
import { sendContactEmail } from '../services/emailService.js';
import { validationResult } from 'express-validator';

/**
 * Submit Contact Form
 * 
 *  Child Explanation:
 * "This chef receives the contact form, saves it, and sends emails."
 * 
 *  Technical Explanation:
 * "Handles contact form submission with validation, storage, and email notification."
 */
export const submitContactForm = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
        })),
        timestamp: new Date().toISOString(),
      });
    }

    const { name, email, phone, subject, message } = req.body;

    // Get IP and user agent
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Save to database
    const submission = await ContactSubmission.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      ipAddress: typeof ipAddress === 'string' ? ipAddress : ipAddress[0],
      userAgent,
    });

    // Send emails (don't await to avoid blocking response)
    // We'll send in background, but catch errors
    sendContactEmail({ name, email, phone, subject, message }, ipAddress, userAgent)
      .then(() => {
        console.log('📧 Emails sent for contact submission:', submission._id);
      })
      .catch((error) => {
        console.error('❌ Email sending failed for submission:', submission._id, error.message);
      });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We\'ll get back to you within 24 hours.',
      data: {
        id: submission._id,
        createdAt: submission.createdAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Contact Submissions (Admin only - placeholder)
 * 
 *  Child Explanation:
 * "This gets all the messages people have sent."
 * 
 *  Technical Explanation:
 * "Retrieves contact submissions with pagination (admin only)."
 */
export const getContactSubmissions = async (req, res, next) => {
  try {
    // This will be used in Phase 5 (Admin panel)
    const { page = 1, limit = 20, status } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [submissions, total] = await Promise.all([
      ContactSubmission.find(filter)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      ContactSubmission.countDocuments(filter),
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Contact submissions retrieved successfully',
      data: submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};