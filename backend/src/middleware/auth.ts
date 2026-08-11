import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, 'Missing authorization header');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Invalid authorization header format');
    }

    const token = authHeader.substring(7);

    const decoded = await verifyToken(token);

    req.user = {
      id: decoded.userId,
      email: '', // Not in JWT, populated if needed via getCurrentUser
      role: decoded.role as any,
      name: '',
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(new ApiError(401, 'Authentication failed'));
  }
}
