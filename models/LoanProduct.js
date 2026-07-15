// FILE: backend/src/models/LoanProduct.js


import mongoose from 'mongoose';

/**
 * Loan Product Schema
 * 
 *  Child Explanation:
 * "This is a form that stores information about different types of loans.
 * It has fields for the loan name, how much you can borrow, interest rate, and features."
 * 
 *  Technical Explanation:
 * "Mongoose schema for loan products with validation,
 * pre-save hooks for data integrity, and comprehensive fields."
 */
const loanProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters'],
  },
  minAmount: {
    type: Number,
    required: [true, 'Minimum amount is required'],
    min: [0, 'Minimum amount cannot be negative'],
  },
  maxAmount: {
    type: Number,
    required: [true, 'Maximum amount is required'],
    min: [0, 'Maximum amount cannot be negative'],
  },
  interestRate: {
    type: Number,
    required: [true, 'Interest rate is required'],
    min: [0, 'Interest rate cannot be negative'],
    max: [100, 'Interest rate cannot exceed 100%'],
  },
  processingFee: {
    type: Number,
    default: 0,
    min: [0, 'Processing fee cannot be negative'],
  },
  repaymentPeriod: {
    type: Number, // in months
    required: [true, 'Repayment period is required'],
    min: [1, 'Repayment period must be at least 1 month'],
  },
  features: [{
    type: String,
    trim: true,
  }],
  iconName: {
    type: String,
    default: 'WalletIcon',
  },
  color: {
    type: String,
    default: 'blue',
    enum: ['blue', 'green', 'purple', 'orange', 'red'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Pre-save validation: minAmount must be less than maxAmount
loanProductSchema.pre('save', function(next) {
  if (this.minAmount >= this.maxAmount) {
    next(new Error('Minimum amount must be less than maximum amount'));
  }
  next();
});

loanProductSchema.index({ isActive: 1, name: 1 });

export const LoanProduct = mongoose.model('LoanProduct', loanProductSchema);