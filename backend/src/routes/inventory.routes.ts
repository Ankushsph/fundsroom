import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import {
  stockInHandler,
  stockOutHandler,
  getProductMovementsHandler,
  getAllMovementsHandler,
} from '../controllers/inventory.controller';

const router = Router();

// All inventory endpoints require authentication
router.use(authenticate);

// Stock IN - ADMIN, WAREHOUSE can add stock
router.post('/stock-in', requireRole('ADMIN', 'WAREHOUSE'), stockInHandler);

// Stock OUT - ADMIN, WAREHOUSE can remove stock
router.post('/stock-out', requireRole('ADMIN', 'WAREHOUSE'), stockOutHandler);

// Get all stock movements - ADMIN, WAREHOUSE, SALES, ACCOUNTS can view
router.get('/movements', requireRole('ADMIN', 'WAREHOUSE', 'SALES', 'ACCOUNTS'), getAllMovementsHandler);

// Get stock movements for a specific product - ADMIN, WAREHOUSE, SALES, ACCOUNTS can view
router.get('/products/:productId/movements', requireRole('ADMIN', 'WAREHOUSE', 'SALES', 'ACCOUNTS'), getProductMovementsHandler);

export default router;
