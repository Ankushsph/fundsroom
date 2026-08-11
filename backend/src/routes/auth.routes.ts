import express from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// Public endpoints
router.post('/login', asyncHandler(login));

// Protected endpoints
router.get('/me', asyncHandler(authenticate), asyncHandler(getMe));

export default router;
