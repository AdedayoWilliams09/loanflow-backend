// FILE: backend/src/controllers/loanProductController.js


import { LoanProduct } from '../models/LoanProduct.js';

/**
 * Get Active Loan Products
 * 
 *  Child Explanation:
 * "This chef shows all the different loan options available, like
 * personal loans, business loans, and student loans."
 * 
 *  Technical Explanation:
 * "This controller retrieves active loan products with optional
 * limit and filtering."
 */
export const getLoanProducts = async (req, res, next) => {
  try {
    const { limit = 10, isActive = true } = req.query;
    
    const products = await LoanProduct.find({ 
      isActive: isActive === 'true' || isActive === true 
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      message: 'Loan products retrieved successfully',
      data: products,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};