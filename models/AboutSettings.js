// FILE: backend/src/models/AboutSettings.js


import mongoose from 'mongoose';

/**
 * About Settings Schema
 * 
 *  Child Explanation:
 * "This stores all the text and images for the About page,
 * like the mission statement and company story."
 * 
 *  Technical Explanation:
 * "Mongoose schema for about page content management."
 */
const aboutSettingsSchema = new mongoose.Schema({
  heroHeading: {
    type: String,
    default: 'Empowering Financial Freedom',
    trim: true,
  },
  heroSubheading: {
    type: String,
    default: "We're on a mission to make loans accessible, transparent, and fair for everyone",
    trim: true,
  },
  heroImageUrl: {
    type: String,
    default: null,
  },
  heroImagePublicId: {
    type: String,
    default: null,
  },
  storyTitle: {
    type: String,
    default: 'Our Story',
    trim: true,
  },
  storyContent: {
    type: String,
    default: 'LoanFlow was founded in 2020 with a simple vision...',
    trim: true,
  },
  missionStatement: {
    type: String,
    default: 'To democratize access to affordable loans and empower individuals and businesses to achieve their financial goals.',
    trim: true,
  },
  values: [{
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'HeartIcon',
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Singleton pattern - only one settings document
aboutSettingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne({ isActive: true });
  if (!settings) {
    settings = await this.create({ isActive: true });
  }
  return settings;
};

export const AboutSettings = mongoose.model('AboutSettings', aboutSettingsSchema);