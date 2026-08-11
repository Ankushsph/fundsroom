import { Request, Response } from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerNotes,
  createCustomerNote,
  updateCustomerNote,
  deleteCustomerNote,
} from '../services/customer.service';
import { createCustomerSchema, updateCustomerSchema, createNoteSchema } from '../schemas/customer.schema';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const getCustomersHandler = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  const status = req.query.status as string;
  const type = req.query.type as string;

  if (page < 1 || limit < 1) {
    throw new ApiError(400, 'Page and limit must be positive numbers');
  }

  const result = await getCustomers(page, limit, search, status, type);
  res.json({
    success: true,
    data: result.customers,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
});

export const getCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await getCustomerById(id);

  res.json({
    success: true,
    data: customer,
  });
});

export const createCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const validated = createCustomerSchema.parse(req.body);
  const customer = await createCustomer(validated);

  res.status(201).json({
    success: true,
    data: customer,
  });
});

export const updateCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = updateCustomerSchema.parse(req.body);

  if (Object.keys(validated).length === 0) {
    throw new ApiError(400, 'No fields to update');
  }

  const customer = await updateCustomer(id, validated);

  res.json({
    success: true,
    data: customer,
  });
});

export const deleteCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteCustomer(id);

  res.json({
    success: true,
    message: 'Customer deleted successfully',
  });
});

export const getCustomerNotesHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (page < 1 || limit < 1) {
    throw new ApiError(400, 'Page and limit must be positive numbers');
  }

  const result = await getCustomerNotes(id, page, limit);

  res.json({
    success: true,
    data: result.notes,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
});

export const createCustomerNoteHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = createNoteSchema.parse(req.body);
  const userId = (req as any).user.userId;

  const note = await createCustomerNote(id, validated.noteText, userId);

  res.status(201).json({
    success: true,
    data: note,
  });
});

export const updateCustomerNoteHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id, noteId } = req.params;
  const validated = createNoteSchema.parse(req.body);

  const note = await updateCustomerNote(id, noteId, validated.noteText);

  res.json({
    success: true,
    data: note,
  });
});

export const deleteCustomerNoteHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id, noteId } = req.params;
  await deleteCustomerNote(id, noteId);

  res.json({
    success: true,
    message: 'Note deleted successfully',
  });
});
