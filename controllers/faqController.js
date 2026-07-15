// FILE: backend/src/controllers/faqController.js


import { FAQ } from '../models/FAQ.js';

/**
 * Get Active FAQs
 * 
 *  Child Explanation:
 * "This chef looks at all the questions and answers and only shows the
 * ones marked as 'active'. It organizes them by category and order."
 * 
 *  Technical Explanation:
 * "This controller retrieves active FAQs from the database with optional
 * category filtering and sorting."
 */
export const getFAQs = async (req, res, next) => {
  try {
    const { limit = 10, category, isActive = true } = req.query;
    
    const filter = { 
      isActive: isActive === 'true' || isActive === true 
    };
    
    if (category) {
      filter.category = category;
    }
    
    const faqs = await FAQ.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      message: 'FAQs retrieved successfully',
      data: faqs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};