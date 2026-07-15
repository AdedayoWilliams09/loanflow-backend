// FILE: backend/src/controllers/homepageController.js

import { Settings } from '../models/Settings.js';
import { FAQ } from '../models/FAQ.js';
import { Testimonial } from '../models/Testimonial.js';
import { LoanProduct } from '../models/LoanProduct.js';

export const getHomepageData = async (req, res, next) => {
  try {
    // Run database queries concurrently
    const [heroSetting, statsSetting, featuresSetting, testimonials, faqs, loanProducts] = await Promise.all([
      Settings.findOne({ key: 'hero' }),
      Settings.findOne({ key: 'stats' }),
      Settings.findOne({ key: 'features' }),
      Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).limit(3),
      FAQ.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).limit(6),
      LoanProduct.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).limit(4)
    ]);

    // Handle Defaults
    const hero = heroSetting ? heroSetting.value : {
      heading: 'Get Fast, Flexible Loans When You Need Them Most',
      subheading: 'Apply in minutes, get approval within 24 hours, and access funds to grow your business or handle personal needs',
      ctaText: 'Apply Now',
      ctaLink: '/auth/register',
      secondaryCtaText: 'Learn More',
      secondaryCtaLink: '#features',
      imageUrl: null,
      isActive: true,
    };

    const stats = statsSetting ? statsSetting.value : {
      customers: '10,000+',
      disbursed: '₦50 Billion',
      approvalRate: '98%',
      processingTime: '24-Hour',
      customersLabel: 'Happy Customers',
      disbursedLabel: 'Disbursed to Date',
      approvalRateLabel: 'Approval Rate',
      processingTimeLabel: 'Average Processing',
    };

    const features = featuresSetting ? featuresSetting.value : [
      { title: 'Fast Approval', description: 'Get approved within 24 hours', icon: 'RocketLaunchIcon', color: 'blue' },
      { title: 'Flexible Repayment', description: 'Choose from multiple options', icon: 'CalendarIcon', color: 'green' },
      { title: 'Low Interest Rates', description: 'Competitive rates, no hidden fees', icon: 'ShieldCheckIcon', color: 'purple' },
      { title: 'Secure & Trusted', description: 'Bank-level security systems', icon: 'LockClosedIcon', color: 'orange' },
    ];

    res.status(200).json({
      success: true,
      message: 'Homepage data compiled successfully',
      data: { hero, stats, features, testimonials, faqs, loanProducts },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};