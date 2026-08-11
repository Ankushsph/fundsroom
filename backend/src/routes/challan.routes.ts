import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import {
  createChallanHandler,
  getChallanHandler,
  getChallansHandler,
  updateChallanHandler,
  confirmChallanHandler,
  cancelChallanHandler,
} from '../controllers/challan.controller';

const router = Router();

// All challan endpoints require authentication
router.use(authenticate);

// Get all challans - ADMIN, SALES can view
router.get('/', requireRole('ADMIN', 'SALES'), getChallansHandler);

// Get challan by id - ADMIN, SALES can view
router.get('/:id', requireRole('ADMIN', 'SALES'), getChallanHandler);

// Create challan - ADMIN, SALES can create
router.post('/', requireRole('ADMIN', 'SALES'), createChallanHandler);

// Update challan (DRAFT only) - ADMIN, SALES can update
router.put('/:id', requireRole('ADMIN', 'SALES'), updateChallanHandler);

// Confirm challan (DRAFT -> CONFIRMED, atomic stock deduction) - ADMIN, SALES can confirm
router.post('/:id/confirm', requireRole('ADMIN', 'SALES'), confirmChallanHandler);

// Cancel challan - ADMIN, SALES can cancel
router.post('/:id/cancel', requireRole('ADMIN', 'SALES'), cancelChallanHandler);

export default router;
