import express from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public endpoints
router.post('/login', login);

// Protected endpoints
router.get('/me', authenticate, getMe);

export default router;
