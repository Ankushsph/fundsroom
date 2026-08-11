import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import {
  getCustomersHandler,
  getCustomerHandler,
  createCustomerHandler,
  updateCustomerHandler,
  deleteCustomerHandler,
  getCustomerNotesHandler,
  createCustomerNoteHandler,
  updateCustomerNoteHandler,
  deleteCustomerNoteHandler,
} from '../controllers/customer.controller';

const router = Router();

// All customer endpoints require authentication
router.use(authenticate);

// Get all customers - ADMIN, SALES, WAREHOUSE, ACCOUNTS can read
router.get('/', requireRole('ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'), getCustomersHandler);

// Get customer by id - ADMIN, SALES, WAREHOUSE, ACCOUNTS can read
router.get('/:id', requireRole('ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'), getCustomerHandler);

// Create customer - ADMIN, SALES can create
router.post('/', requireRole('ADMIN', 'SALES'), createCustomerHandler);

// Update customer - ADMIN, SALES can update
router.put('/:id', requireRole('ADMIN', 'SALES'), updateCustomerHandler);

// Delete customer - only ADMIN can delete
router.delete('/:id', requireRole('ADMIN'), deleteCustomerHandler);

// Get customer notes - ADMIN, SALES, WAREHOUSE, ACCOUNTS can read
router.get('/:id/notes', requireRole('ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'), getCustomerNotesHandler);

// Create customer note - ADMIN, SALES can create
router.post('/:id/notes', requireRole('ADMIN', 'SALES'), createCustomerNoteHandler);

// Update customer note - ADMIN, SALES can update
router.put('/:id/notes/:noteId', requireRole('ADMIN', 'SALES'), updateCustomerNoteHandler);

// Delete customer note - ADMIN can delete any note, SALES can delete their own
router.delete('/:id/notes/:noteId', requireRole('ADMIN', 'SALES'), deleteCustomerNoteHandler);

export default router;
