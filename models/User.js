// FILE: backend/models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * User Schema
 * 
 *  Child Explanation:
 * "This stores information about people who sign up for LoanFlow."
 * 
 *  Technical Explanation:
 * "Mongoose schema for users with authentication, profile, and role fields."
 */
const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Automatically creates the unique email index
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  
  // Authentication
  password: {
    type: String,
    required: function() {
      return this.authProvider === 'local' || this.authProvider === 'both';
    },
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Don't return password by default
  },
  googleId: {
    type: String,
    sparse: true,
    index: true, // Automatically creates the sparse googleId index
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'both'],
    default: 'local',
  },
  
  // Profile
  profilePicture: {
    type: String,
    default: null,
  },
  profilePicturePublicId: {
    type: String,
    default: null,
  },
  
  // Verification
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  verificationTokenExpiry: {
    type: Date,
    default: null,
  },
  
  // Password Reset
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpiry: {
    type: Date,
    default: null,
  },
  
  // Role & Status
  role: {
    type: String,
    enum: ['customer', 'loan_officer', 'admin'],
    default: 'customer',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Account Security
  lastLogin: {
    type: Date,
    default: null,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
    default: null,
  },
  
  // Preferences
  preferences: {
    notifications: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
  },
}, {
  timestamps: true,
});

// --- Indexes ---
userSchema.index({ role: 1 });

// --- Pre-save Hooks ---

/**
 * Hash password before saving
 */
userSchema.pre('save', async function() {
  // If password was not modified, exit early
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- Instance Methods ---

/**
 * Compare password
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate JWT Access Token
 */
userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

/**
 * Generate JWT Refresh Token
 */
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

/**
 * Get public profile
 */
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
    role: this.role,
    profilePicture: this.profilePicture,
    isEmailVerified: this.isEmailVerified,
    preferences: this.preferences,
    createdAt: this.createdAt,
  };
};

// --- Static Methods ---

/**
 * Find or create user from Google profile
 */
userSchema.statics.findOrCreateFromGoogle = async function(profile) {
  const email = profile.emails[0].value;
  const name = profile.displayName.split(' ');
  
  let user = await this.findOne({ 
    $or: [
      { googleId: profile.id },
      { email: email }
    ]
  });
  
  if (user) {
    // If user exists but doesn't have googleId, link it
    if (!user.googleId) {
      user.googleId = profile.id;
      user.authProvider = user.authProvider === 'local' ? 'both' : 'google';
      user.isEmailVerified = true;
      await user.save();
    }
    return user;
  }
  
  // Create new user
  user = await this.create({
    firstName: name[0] || 'Google',
    lastName: name.slice(1).join(' ') || 'User',
    email: email,
    googleId: profile.id,
    authProvider: 'google',
    isEmailVerified: true,
    profilePicture: profile.photos[0]?.value || null,
  });
  
  return user;
};

export const User = mongoose.model('User', userSchema);