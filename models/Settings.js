// FILE: backend/src/models/Settings.js
// CREATED: New file

import mongoose from 'mongoose';

/**
 * Settings Schema
 * 
 *  Child Explanation:
 * "This is a form that stores settings for the website.
 * It has a key (like 'hero' or 'stats') and a value (the actual content)."
 * 
 *  Technical Explanation:
 * "Mongoose schema for application settings with key-value
 * structure for flexible configuration."
 */
const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Settings key is required'],
    unique: true,
    enum: ['hero', 'stats', 'features', 'steps'],
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Settings value is required'],
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

// Static method to get settings by key
settingsSchema.statics.getByKey = async function(key) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : null;
};

export const Settings = mongoose.model('Settings', settingsSchema);