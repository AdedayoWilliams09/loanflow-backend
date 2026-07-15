// FILE: backend/src/models/FAQ.js


import mongoose from 'mongoose';

/**
 * FAQ Schema
 * 
 *  Child Explanation:
 * "This is a form that stores questions and answers.
 * It has fields for the question, answer, what category it belongs to, and its order."
 * 
 *  Technical Explanation:
 * "Mongoose schema for Frequently Asked Questions with
 * category enumeration and ordering support."
 */
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [200, 'Question cannot exceed 200 characters'],
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['general', 'loans', 'repayment', 'account'],
    default: 'general',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Compound index for efficient filtering
faqSchema.index({ isActive: 1, category: 1, order: 1 });

export const FAQ = mongoose.model('FAQ', faqSchema);