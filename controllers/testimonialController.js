// FILE: backend/src/controllers/testimonialController.js
// CREATED: New file

import { Testimonial } from '../models/Testimonial.js';

/**
 * Get Active Testimonials
 * 
 *  Child Explanation:
 * "This chef looks at all the customer reviews and only shows the ones
 * that are marked as 'active'. It sorts them nicely and gives back
 * a limited number."
 * 
 *  Technical Explanation:
 * "This controller retrieves active testimonials from the database.
 * It supports pagination and sorting to efficiently handle data."
 */
export const getTestimonials = async (req, res, next) => {
  try {
    const { limit = 6, page = 1, isActive = true } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const testimonials = await Testimonial.find({ 
      isActive: isActive === 'true' || isActive === true 
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Testimonial.countDocuments({ 
      isActive: isActive === 'true' || isActive === true 
    });
    
    res.status(200).json({
      success: true,
      message: 'Testimonials retrieved successfully',
      data: testimonials,
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