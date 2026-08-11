import { Request, Response } from 'express';
import {
  addStockIn,
  addStockOut,
  getStockMovementHistory,
  getAllStockMovements,
} from '../services/inventory.service';
import { stockInSchema, stockOutSchema } from '../schemas/inventory.schema';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const stockInHandler = asyncHandler(async (req: Request, res: Response) => {
  const validated = stockInSchema.parse(req.body);
  const userId = (req as any).user.userId;

  const result = await addStockIn(validated, userId);

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const stockOutHandler = asyncHandler(async (req: Request, res: Response) => {
  const validated = stockOutSchema.parse(req.body);
  const userId = (req as any).user.userId;

  const result = await addStockOut(validated, userId);

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const getProductMovementsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (page < 1 || limit < 1) {
    throw new ApiError(400, 'Page and limit must be positive numbers');
  }

  const result = await getStockMovementHistory(productId, page, limit);

  res.json({
    success: true,
    data: result.movements,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
});

export const getAllMovementsHandler = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (page < 1 || limit < 1) {
    throw new ApiError(400, 'Page and limit must be positive numbers');
  }

  const result = await getAllStockMovements(page, limit);

  res.json({
    success: true,
    data: result.movements,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
});
