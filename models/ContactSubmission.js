// FILE: backend/src/models/ContactSubmission.js


import mongoose from 'mongoose';

/**
 * Contact Submission Schema
 * 
 *  Child Explanation:
 * "This stores messages people send us through the contact form."
 * 
 *  Technical Explanation:
 * "Mongoose schema for contact form submissions with status tracking."
 */
const contactSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    enum: ['General Inquiry', 'Loan Application Support', 'Repayment Help', 'Feedback', 'Complaint', 'Other'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'spam'],
    default: 'new',
  },
  ipAddress: {
    type: String,
    default: null,
  },
  userAgent: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
contactSubmissionSchema.index({ status: 1, createdAt: -1 });
contactSubmissionSchema.index({ email: 1 });

export const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);