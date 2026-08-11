import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import {
  getProductsHandler,
  getProductHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from '../controllers/product.controller';

const router = Router();

// All product endpoints require authentication
router.use(authenticate);

// Get all products - ADMIN, WAREHOUSE, SALES, ACCOUNTS can read
router.get('/', requireRole('ADMIN', 'WAREHOUSE', 'SALES', 'ACCOUNTS'), getProductsHandler);

// Get product by id - ADMIN, WAREHOUSE, SALES, ACCOUNTS can read
router.get('/:id', requireRole('ADMIN', 'WAREHOUSE', 'SALES', 'ACCOUNTS'), getProductHandler);

// Create product - ADMIN, WAREHOUSE can create
router.post('/', requireRole('ADMIN', 'WAREHOUSE'), createProductHandler);

// Update product - ADMIN, WAREHOUSE can update
router.put('/:id', requireRole('ADMIN', 'WAREHOUSE'), updateProductHandler);

// Delete product - only ADMIN can delete
router.delete('/:id', requireRole('ADMIN'), deleteProductHandler);

export default router;
