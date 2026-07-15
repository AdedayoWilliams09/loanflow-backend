// FILE: backend/src/models/Testimonial.js


import mongoose from 'mongoose';

/**
 * Testimonial Schema
 * 
 *  Child Explanation:
 * "This is a form that stores what customers say about us.
 * It has fields for their name, role, what they said, and how many stars they gave."
 * 
 *  Technical Explanation:
 * "Mongoose schema for customer testimonials with validation,
 * indexing for efficient queries, and timestamps for tracking."
 */
const testimonialSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  customerRole: {
    type: String,
    required: [true, 'Customer role is required'],
    trim: true,
    maxlength: [100, 'Role cannot exceed 100 characters'],
  },
  content: {
    type: String,
    required: [true, 'Testimonial content is required'],
    trim: true,
    maxlength: [500, 'Content cannot exceed 500 characters'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 5,
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  avatarPublicId: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Create indexes for faster queries
testimonialSchema.index({ isActive: 1, order: 1 });

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);