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
import passport from 'passport';
import mongoose from 'mongoose';

import connectDB from './config/db.js';
import { configurePassport } from './config/passport.js';

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
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const validateEnv = () => {
  const required = ['PORT', 'MONGO_URI', 'FRONTEND_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(' Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
  }
};

validateEnv();

const app = express();
app.set('trust proxy', 1);

const PORT = parseInt(process.env.PORT, 10);

// 1. Security Headers
app.use(helmet());

// 2. CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  `http://localhost:${PORT}`,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

// 3. Swagger UI (Correct single-mount setup)
const swaggerSpec = getSwaggerUI();
if (swaggerSpec) {
  app.use('/api-docs', swaggerUi.serve, swaggerSpec);
  console.log(` API Documentation: http://localhost:${PORT}/api-docs`);
}

// 4. Body Parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Passport
configurePassport();
app.use(passport.initialize());

// 6. Morgan Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 7. General API Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    if (req.method === 'OPTIONS') return true;
    return req.method === 'GET' && (
      req.originalUrl.startsWith('/api/loan-products') || 
      req.originalUrl.startsWith('/api/team') ||
      req.originalUrl.startsWith('/api/faqs')
    );
  }
});

app.use('/api', limiter);

// 8. Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
  });
});

// 9. Application Routes
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
app.use('/api/auth', authRoutes);

// 10. Handlers
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();