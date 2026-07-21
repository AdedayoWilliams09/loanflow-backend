// FILE: backend/server.js

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import getSwaggerUI from './config/swagger.js';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import testRoutes from './routes/testRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import loanProductRoutes from './routes/loanProductRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import emailRoutes from './routes/emailRoutes.js'; 


// Load environment variables from .env file
dotenv.config();

/**
 * Validate required environment variables
 * 
 *  Child Explanation:
 * "Before we start cooking, we check our secret notebook to make sure we have
 * all the important information written down. If something is missing, we stop
 * and say 'We can't start yet!'"
 * 
 *  Technical Explanation:
 * "This function validates that all required environment variables are present.
 * If any are missing, the application exits with a clear error message.
 * This prevents runtime errors caused by missing configuration."
 */
const validateEnv = () => {
  const required = ['PORT', 'MONGO_URI', 'FRONTEND_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(' Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n💡 Please check your .env file and add the missing variables.');
    process.exit(1);
  }
  
  // Validate that PORT is a valid number
  const port = parseInt(process.env.PORT, 10);
  if (isNaN(port) || port < 0 || port > 65535) {
    console.error(` Invalid PORT value: ${process.env.PORT}`);
    console.error('   PORT must be a number between 0 and 65535');
    process.exit(1);
  }
  
  // Validate FRONTEND_URL is a valid URL
  try {
    new URL(process.env.FRONTEND_URL);
  } catch {
    console.error(` Invalid FRONTEND_URL: ${process.env.FRONTEND_URL}`);
    console.error('   Please provide a valid URL including protocol (http:// or https://)');
    process.exit(1);
  }
  
  console.log(' All environment variables validated');
};

// Run environment validation
validateEnv();

// Initialize Express app
const app = express();

// Trust reverse proxies (Required for Render, Heroku, Vercel & rate-limiting)
app.set('trust proxy', 1);

const PORT = parseInt(process.env.PORT, 10);

/**
 * Security and Middleware Setup
 * 
 *  Child Explanation:
 * "These are all the security guards, phone operators, and helpers we set up
 * before we start taking orders. They make sure everything is safe and organized."
 * 
 *  Technical Explanation:
 * "We configure middleware in a specific order. The order matters because
 * middleware runs sequentially. We put security and parsing middleware first,
 * then logging, then routes, then error handling."
 */

// 1. Security Headers (Helmet)
//  "This puts locks on all doors and windows"
app.use(helmet());

// 2. CORS Configuration
//  "This is a security guard that only lets approved people in"
// 2. CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
}));

// Swagger Documentation
const swaggerUI = getSwaggerUI();
if (swaggerUI) {
  app.use('/api-docs', swaggerUi.serve, swaggerUI);
  console.log(` API Documentation: http://localhost:${PORT}/api-docs`);
}

// 3. Compression (makes responses smaller and faster)
//  "This is like packing files into a smaller suitcase"
app.use(compression());

// 4. Body Parsing Middleware
//  "This is like a translator that understands the language of requests"
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Logging (Morgan)
//  "This is like a security camera that records who visited"
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 6. Rate Limiting
//  "This is like a bouncer that limits how many people can enter"
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

  skip: (req) => {
    return req.method === 'GET' && (
      req.originalUrl.startsWith('/api/loan-products') || 
      req.originalUrl.startsWith('/api/team') ||
      req.originalUrl.startsWith('/api/faqs')
    );
  }
});


app.use('/api', limiter);

// 7. Health Check Endpoint (before API routes - always available)
//  "This is a quick way to check if the kitchen is open"
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
  });
});

// 8. API Routes
//  "These are the signs that direct people to different stations"


app.use('/api/health', healthRoutes);
app.use('/api/test', testRoutes);

app.use('/api', homepageRoutes);

app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/loan-products', loanProductRoutes);


app.use('/api/team', teamRoutes);
app.use('/api/settings/about', aboutRoutes);

app.use('/api/settings', settingsRoutes);

app.use('/api/contact', contactRoutes);

app.use('/api/email', emailRoutes);

// 9. 404 Handler (must be after all routes)
//  "This is for when someone asks for something that doesn't exist"
app.use(notFoundHandler);

// 10. Global Error Handler (must be last)
//  "This is our emergency response team"
app.use(errorHandler);



/**
 * Start Server
 * 
 *  Child Explanation:
 * "This is like opening the restaurant. We make sure the phone line to the
 * fridge is working, then we open the doors and start taking orders."
 * 
 *  Technical Explanation:
 * "We connect to the database first, then start the server. This ensures
 * the application is fully ready before accepting requests."
 */
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV}`);
      console.log(` Health check: http://localhost:${PORT}/health`);
      console.log(` API endpoint: http://localhost:${PORT}/api/health`);
      console.log(` Test endpoint: http://localhost:${PORT}/api/test`);
      console.log(` CORS allowed: ${process.env.FRONTEND_URL}`);
    });
    
    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log(' HTTP server closed');
        // Close database connection
        await mongoose.connection.close();
        console.log(' MongoDB connection closed');
        process.exit(0);
      });
    };
    
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
  } catch (error) {
    console.error(' Failed to start server:', error.message);
    process.exit(1);
  }
};

// Import mongoose for graceful shutdown
import mongoose from 'mongoose';

// Start the server
startServer();