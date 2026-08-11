import { Request, Response } from 'express';
import { authenticateUser, getCurrentUser } from '../services/auth.service';
import { loginSchema } from '../schemas/auth.schema';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const login = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, 'Validation failed', {
      errors: validation.error.errors,
    });
  }

  const { email, password } = validation.data;

  // Authenticate user
  const { token, user } = await authenticateUser(email, password);

  res.status(200).json({
    success: true,
    data: {
      token,
      user,
    },
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const user = await getCurrentUser(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
