// FILE: backend/controllers/healthController.js


import mongoose from 'mongoose';

/**
 * Health Check Controller
 * 
 *  Child Explanation:
 * "This chef's only job is to tell you if the restaurant is open and if the
 * phone line to the fridge (database) is working. They always answer quickly."
 * 
 *  Technical Explanation:
 * "This controller returns the system health status. It checks the MongoDB
 * connection state and returns the server uptime. This endpoint is designed
 * to be fast and lightweight for monitoring purposes."
 */
export const healthCheck = (req, res) => {
  // Get MongoDB connection status
  const mongoState = mongoose.connection.readyState;
  const mongoConnected = mongoState === 1; // 1 = connected
  
  // Calculate uptime in seconds
  const uptime = process.uptime();
  const uptimeFormatted = formatUptime(uptime);
  
  // Prepare health response
  const healthResponse = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: uptime,
    uptimeFormatted: uptimeFormatted,
    mongoConnected: mongoConnected,
    mongoState: mongoState,
    mongoStateDescription: getMongoStateDescription(mongoState),
    environment: process.env.NODE_ENV || 'development',
  };
  
  res.status(200).json(healthResponse);
};

/**
 * Format uptime into readable string
 * 
 *  Child Explanation:
 * "This takes the number of seconds the kitchen has been open and turns it
 * into something easy to read like '2 hours and 15 minutes'."
 * 
 *  Technical Explanation:
 * "Helper function to format the server uptime from seconds into a
 * human-readable string with days, hours, minutes, and seconds."
 */
const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
};

/**
 * Get description for MongoDB connection state
 * 
 *  Child Explanation:
 * "This turns the number from the phone system into plain English words so
 * it's easier to understand what's happening with our database line."
 * 
 *  Technical Explanation:
 * "Maps the numeric connection state from Mongoose to a human-readable description."
 */
const getMongoStateDescription = (state) => {
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    99: 'Uninitialized',
  };
  return states[state] || 'Unknown';
};