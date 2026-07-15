// FILE: backend/src/routes/loanProductRoutes.js


import express from 'express';
import { getLoanProducts } from '../controllers/loanProductController.js';

const router = express.Router();

/**
 * GET /api/loan-products
 *  "This sign says 'Loan options are here!'"
 *  "Retrieves active loan products with limit support"
 */
router.get('/', getLoanProducts);

export default router;