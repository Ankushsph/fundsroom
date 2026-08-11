import { ChallanStatus } from '@prisma/client';
import { Request, Response } from 'express';
import {
  createChallan,
  getChallan,
  getChallans,
  updateChallan,
  cancelChallan,
} from '../services/challan.service';
import { confirmChallan } from '../services/challan-confirmation.service';
import { createChallanSchema, updateChallanSchema } from '../schemas/challan.schema';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const createChallanHandler = asyncHandler(async (req: Request, res: Response) => {
  const validated = createChallanSchema.parse(req.body);
  const userId = req.user!.id;

  const challan = await createChallan(validated, userId);

  res.status(201).json({
    success: true,
    data: challan,
  });
});

export const getChallanHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const challan = await getChallan(id);

  res.json({
    success: true,
    data: challan,
  });
});

export const getChallansHandler = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string | undefined;

  if (page < 1 || limit < 1) {
    throw new ApiError(400, 'Page and limit must be positive numbers');
  }

  if (status && !Object.values(ChallanStatus).includes(status as ChallanStatus)) {
    throw new ApiError(400, 'Invalid challan status filter');
  }

  const result = await getChallans(page, limit, status);

  res.json({
    success: true,
    data: result.challans,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
});

export const updateChallanHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = updateChallanSchema.parse(req.body);

  const challan = await updateChallan(id, validated);

  res.json({
    success: true,
    data: challan,
  });
});

export const confirmChallanHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const challan = await confirmChallan(id);

  res.json({
    success: true,
    message: 'Challan confirmed successfully',
    data: challan,
  });
});

export const cancelChallanHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const challan = await cancelChallan(id, req.user!.id);

  res.json({
    success: true,
    data: challan,
  });
});
