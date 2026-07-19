// FILE: backend/src/controllers/loanProductController.js
// MODIFIED: Swapped out precise boundary limits for query amount range intersection checks

import { LoanProduct } from '../models/LoanProduct.js';

/**
 * Get Active Loan Products with Filtering
 * 
 * 🧒 Child Explanation:
 * "This chef can now find specific loans based on what you're looking for -
 * like the type of loan, how much you want to borrow, and how long you need it for."
 * 
 * 👨‍💻 Technical Explanation:
 * "Enhanced controller with filtering, search, and pagination support.
 * Supports query parameters for type, amount range, duration, and search."
 */
export const getLoanProducts = async (req, res, next) => {
  try {
    const {
      type,
      minAmount,
      maxAmount,
      duration,
      search,
      page = 1,
      limit = 10,
      isActive = true,
    } = req.query;

    // 1. Build operational query filter object
    const filter = { isActive: isActive === 'true' || isActive === true };

    // 2. Filter by type (using case-insensitive regex pattern matching)
    if (type && type !== 'all') {
      filter.name = { $regex: type, $options: 'i' };
    }

    // 3. FIXED: Filter by amount range intersection parameters
    if (minAmount || maxAmount) {
      if (minAmount) {
        // Find loans where the maximum limit is greater than or equal to the user's minimum search boundary
        filter.maxAmount = { ...filter.maxAmount, $gte: parseFloat(minAmount) };
      }
      if (maxAmount) {
        // Find loans where the minimum limit is less than or equal to the user's maximum search boundary
        filter.minAmount = { ...filter.minAmount, $lte: parseFloat(maxAmount) };
      }
    }

    // 4. Filter by fixed repayment intervals
    if (duration) {
      filter.repaymentPeriod = parseInt(duration);
    }

    // 5. Match partial keywords inside strings across multiple document schemas
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
      ];
    }

    // 6. Calculate explicit pagination indices
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // 7. Concurrent database query execution for optimized parallel performance
    const [products, total] = await Promise.all([
      LoanProduct.find(filter)
        .sort({ name: 1 }) // Sort alphabetically for standard grid layouts
        .limit(limitNum)
        .skip(skip),
      LoanProduct.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    // 8. Return comprehensive payload complete with state logs
    res.status(200).json({
      success: true,
      message: 'Loan products retrieved successfully',
      data: products,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: totalPages,
      },
      filters: {
        type: type || 'all',
        minAmount: minAmount ? parseFloat(minAmount) : null,
        maxAmount: maxAmount ? parseFloat(maxAmount) : null,
        duration: duration ? parseInt(duration) : null,
        search: search || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Loan Product Types
 * 
 * 🧒 Child Explanation:
 * "This chef gets a list of all the different types of loans available so you can choose them from a menu."
 * 
 * 👨‍💻 Technical Explanation:
 * "Retrieves unique distinct active loan product names to populate lookup select menus dynamically."
 */
export const getLoanProductTypes = async (req, res, next) => {
  try {
    const types = await LoanProduct.distinct('name', { isActive: true });
    
    res.status(200).json({
      success: true,
      message: 'Loan product types retrieved successfully',
      data: types,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};