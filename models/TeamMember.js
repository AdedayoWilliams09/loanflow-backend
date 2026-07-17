// FILE: backend/src/models/TeamMember.js


import mongoose from 'mongoose';

/**
 * Team Member Schema
 * 
 *  Child Explanation:
 * "This is a form that stores information about people who work at LoanFlow.
 * It has fields for their name, job title, biography, and photo."
 * 
 *  Technical Explanation:
 * "Mongoose schema for team members with validation,
 * indexing, and Cloudinary photo integration."
 */
const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team member name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
    maxlength: [100, 'Role cannot exceed 100 characters'],
  },
  bio: {
    type: String,
    required: [true, 'Biography is required'],
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
  },
  photoUrl: {
    type: String,
    default: null,
  },
  photoPublicId: {
    type: String,
    default: null,
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

// Index for efficient queries
teamMemberSchema.index({ isActive: 1, order: 1 });

export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);