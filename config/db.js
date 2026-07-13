// FILE: backend/config/db.js


import mongoose from 'mongoose';

/**
 * Connect to MongoDB with retry logic
 * 
 *  Child Explanation:
 * "This is like trying to call your friend. If they don't answer the first time,
 * we wait a bit and try again. We keep trying until they answer or we give up."
 * 
 *  Technical Explanation:
 * "This establishes a connection to MongoDB with automatic retry on failure.
 * It uses exponential backoff to prevent overwhelming the database server."
 */
const connectDB = async (retries = 5, delay = 5000) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,  // Wait 5 seconds for server selection
      socketTimeoutMS: 45000,          // Close sockets after 45 seconds of inactivity
      family: 4,                       // Use IPv4, skip trying IPv6
    });
    
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    console.log(` Database Name: ${conn.connection.name}`);
    console.log(` Connection State: ${mongoose.connection.readyState}`);
    
    return conn;
    
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    
    if (retries > 0) {
      console.log(` Retrying connection... (${retries} attempts remaining)`);
      console.log(` Waiting ${delay/1000} seconds before retry...`);
      
      // Wait for the specified delay before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry with one less attempt and longer delay (exponential backoff)
      return connectDB(retries - 1, delay * 1.5);
    }
    
    console.error(' Failed to connect to MongoDB after all retries.');
    console.error(' Please check:');
    console.error('   1. Your MongoDB server is running');
    console.error('   2. Your MONGO_URI is correct in .env file');
    console.error('   3. Your network/firewall allows the connection');
    process.exit(1);
  }
};

/**
 * Handle MongoDB connection events
 * 
 *  Child Explanation:
 * "We're setting up alerts for when our phone line to the database has problems.
 * If the line drops, we know about it immediately."
 * 
 *  Technical Explanation:
 * "We attach event listeners to the MongoDB connection to monitor its state
 * and handle disconnections gracefully."
 */
const handleConnectionEvents = () => {
  mongoose.connection.on('connected', () => {
    console.log('📡 MongoDB connection established');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error(` MongoDB connection error: ${err.message}`);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.warn(' MongoDB disconnected. Attempting to reconnect...');
    // Reconnection is handled automatically by Mongoose if autoReconnect is true
  });
  
  // Handle application termination
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log(' MongoDB connection closed through app termination');
    process.exit(0);
  });
};

// Initialize connection event handlers
handleConnectionEvents();

export default connectDB;