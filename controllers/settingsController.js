// FILE: backend/src/controllers/settingsController.js


import { Settings } from '../models/Settings.js';

/**
 * Get Settings by Key
 * 
 *  Child Explanation:
 * "This chef looks in the settings notebook and brings back specific
 * information like the hero message or statistics numbers."
 * 
 *  Technical Explanation:
 * "This controller retrieves settings from the database by key.
 * It can return a specific setting or all settings grouped by key."
 */
export const getSettings = async (req, res, next) => {
  try {
    const { key } = req.params;
    
    if (key) {
      const setting = await Settings.findOne({ key });
      if (!setting) {
        return res.status(404).json({
          success: false,
          message: `Settings with key '${key}' not found`,
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Settings retrieved successfully',
        data: setting.value,
        timestamp: new Date().toISOString(),
      });
    }
    
    // If no key provided, return all settings grouped
    const settings = await Settings.find({});
    const grouped = {};
    settings.forEach(setting => {
      grouped[setting.key] = setting.value;
    });
    
    res.status(200).json({
      success: true,
      message: 'All settings retrieved successfully',
      data: grouped,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Statistics (Trust Stats)
 * 
 * Child Explanation:
 * "This chef gathers all the impressive numbers to show how many
 * customers we have and how much money we've helped with."
 * 
 *  Technical Explanation:
 * "This controller returns statistics from settings or default values
 * if not configured."
 */
export const getStatistics = async (req, res, next) => {
  try {
    // Try to get from settings first
    const statsSetting = await Settings.findOne({ key: 'stats' });
    
    if (statsSetting) {
      return res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: statsSetting.value,
        timestamp: new Date().toISOString(),
      });
    }
    
    // If not in settings, return default stats
    const defaultStats = {
      customers: '10,000+',
      disbursed: '₦50 Billion',
      approvalRate: '98%',
      processingTime: '24-Hour',
      customersLabel: 'Happy Customers',
      disbursedLabel: 'Disbursed to Date',
      approvalRateLabel: 'Approval Rate',
      processingTimeLabel: 'Average Processing',
    };
    
    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: defaultStats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Hero Content
 * 
 * Child Explanation:
 * "This chef brings back the big welcome message and picture
 * that shows at the top of the website."
 * 
 *  Technical Explanation:
 * "This controller retrieves hero section content from settings
 * or returns default content if not configured."
 */
export const getHeroContent = async (req, res, next) => {
  try {
    const hero = await Settings.findOne({ key: 'hero' });
    
    if (!hero) {
      // Return default hero content
      return res.status(200).json({
        success: true,
        message: 'Hero content retrieved successfully',
        data: {
          heading: 'Get Fast, Flexible Loans When You Need Them Most',
          subheading: 'Apply in minutes, get approval within 24 hours, and access funds to grow your business or handle personal needs',
          ctaText: 'Apply Now',
          ctaLink: '/auth/register',
          secondaryCtaText: 'Learn More',
          secondaryCtaLink: '#features',
          imageUrl: null,
          isActive: true,
        },
        timestamp: new Date().toISOString(),
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Hero content retrieved successfully',
      data: hero.value,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Features
 * 
 *  Child Explanation:
 * "This chef brings back all the special things the platform can do,
 * like 'Fast Approval' and 'Flexible Repayment'."
 * 
 *  Technical Explanation:
 * "This controller retrieves feature cards from settings
 * or returns default features if not configured."
 */
export const getFeatures = async (req, res, next) => {
  try {
    const features = await Settings.findOne({ key: 'features' });
    
    if (!features) {
      // Return default features
      const defaultFeatures = [
        {
          title: 'Fast Approval',
          description: 'Get approved within 24 hours with our automated system',
          icon: 'RocketLaunchIcon',
          color: 'blue',
        },
        {
          title: 'Flexible Repayment',
          description: 'Choose from multiple repayment options that suit your needs',
          icon: 'CalendarIcon',
          color: 'green',
        },
        {
          title: 'Low Interest Rates',
          description: 'Competitive rates with transparent fee structure',
          icon: 'ShieldCheckIcon',
          color: 'purple',
        },
        {
          title: 'Secure & Trusted',
          description: 'Bank-level security for your peace of mind',
          icon: 'LockClosedIcon',
          color: 'orange',
        },
      ];
      
      return res.status(200).json({
        success: true,
        message: 'Features retrieved successfully',
        data: defaultFeatures,
        timestamp: new Date().toISOString(),
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Features retrieved successfully',
      data: features.value,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};