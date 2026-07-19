// FILE: backend/src/controllers/faqController.js

import { FAQ } from "../models/FAQ.js";

/**
 * Get Active FAQs with Category Filtering
 *
 *  Child Explanation:
 * "This chef can now find specific questions based on what category you choose
 * and can search for questions that contain certain words."
 *
 *  Technical Explanation:
 * "Enhanced controller with category filtering and case-insensitive regex search support.
 * Includes parallel distinct querying to gather category lists on layout mounts."
 */
export const getFAQs = async (req, res, next) => {
  try {
    const { category, search, limit = 20, isActive = true } = req.query;

    // Build operational filter object
    const filter = { isActive: isActive === "true" || isActive === true };

    // Filter by specific category selection tags
    if (category && category !== "all") {
      filter.category = category;
    }

    // Match keywords using case-insensitive evaluation properties
    if (search) {
     const cleanSearch = search.toLowerCase().trim();
      const searchTerms = cleanSearch === 'approval' ? 'approv' : cleanSearch;

      const searchRegex = { $regex: searchTerms, $options: 'i' };
      filter.$or = [
        { question: searchRegex },
        { answer: searchRegex }
      ];
      
    }

    // Execute database operations concurrently for optimal parallel engine performance
    const [faqs, categories] = await Promise.all([
      FAQ.find(filter).sort({ order: 1, createdAt: -1 }).limit(parseInt(limit)),
      FAQ.distinct("category", { isActive: true }),
    ]);

    res.status(200).json({
      success: true,
      message: "FAQs retrieved successfully",
      data: faqs,
      categories: categories,
      filters: {
        category: category || "all",
        search: search || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get FAQ Categories
 *
 *  Child Explanation:
 * "This chef gets a list of all the different categories of questions so you can pick them from a menu."
 *
 *  Technical Explanation:
 * "Retrieves unique distinct active FAQ category strings to populate layout lookup buttons dynamically."
 */
export const getFAQCategories = async (req, res, next) => {
  try {
    const categories = await FAQ.distinct("category", { isActive: true });

    res.status(200).json({
      success: true,
      message: "FAQ categories retrieved successfully",
      data: categories,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
