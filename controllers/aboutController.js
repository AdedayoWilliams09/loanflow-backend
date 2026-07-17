// FILE: backend/src/controllers/aboutController.js


import { AboutSettings } from '../models/AboutSettings.js';

/**
 * Get About Settings
 * 
 *  Child Explanation:
 * "This chef gets all the content for the About page -
 * the mission, story, values, and hero content."
 * 
 *  Technical Explanation:
 * "Retrieves about page settings or creates default settings if none exist."
 */
export const getAboutSettings = async (req, res, next) => {
  try {
    let settings = await AboutSettings.findOne({ isActive: true });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await AboutSettings.create({
        heroHeading: 'Empowering Financial Freedom',
        heroSubheading: "We're on a mission to make loans accessible, transparent, and fair for everyone",
        storyTitle: 'Our Story',
        storyContent: 'LoanFlow was founded in 2020 with a simple vision: to make borrowing simple, fast, and fair for everyone. We saw that traditional banks were slow, opaque, and often rejected qualified borrowers. We built LoanFlow to change that.',
        missionStatement: 'To democratize access to affordable loans and empower individuals and businesses to achieve their financial goals.',
        values: [
          {
            title: 'Accessibility',
            description: 'Making loans available to everyone, regardless of their background.',
            icon: 'UserGroupIcon',
          },
          {
            title: 'Transparency',
            description: 'Clear terms, no hidden fees, and honest communication.',
            icon: 'EyeIcon',
          },
          {
            title: 'Innovation',
            description: 'Using technology to make borrowing faster and simpler.',
            icon: 'LightBulbIcon',
          },
          {
            title: 'Integrity',
            description: 'Doing the right thing for our customers, every time.',
            icon: 'ShieldCheckIcon',
          },
        ],
        isActive: true,
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'About settings retrieved successfully',
      data: settings,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update About Settings
 * 
 *  Child Explanation:
 * "This chef updates the content on the About page."
 * 
 *  Technical Explanation:
 * "Updates about page settings. Creates new settings if none exist."
 */
export const updateAboutSettings = async (req, res, next) => {
  try {
    const updates = req.body;
    
    let settings = await AboutSettings.findOne({ isActive: true });
    
    if (!settings) {
      settings = await AboutSettings.create(updates);
    } else {
      // Update only the fields that are provided
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
          settings[key] = updates[key];
        }
      });
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'About settings updated successfully',
      data: settings,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};