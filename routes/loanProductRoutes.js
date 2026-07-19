// FILE: backend/src/routes/loanProductRoutes.js


import express from 'express';
import { getLoanProducts, getLoanProductTypes } from '../controllers/loanProductController.js';

const router = express.Router();

/**
 * GET /api/loan-products/types
 *  "This sign says 'What types of loans are available?'"
 *  "Retrieves distinct loan product types"
 */

router.get('/types', getLoanProductTypes);

/**
 * GET /api/loan-products
 *  "This sign says 'All loan options are here!'"
 *  "Retrieves loan products with filtering and pagination"
 */

router.get('/', getLoanProducts);

export default router;