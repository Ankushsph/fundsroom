import { Request, Response } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/product.service';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const getProductsHandler = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  const active = req.query.active ? req.query.active === 'true' : undefined;

  if (page < 1 || limit < 1) {
    throw new ApiError(400, 'Page and limit must be positive numbers');
  }

  const result = await getProducts(page, limit, search, active);

  res.json({
    success: true,
    data: result.products,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
});

export const getProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(id);

  res.json({
    success: true,
    data: product,
  });
});

export const createProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const validated = createProductSchema.parse(req.body);
  const product = await createProduct(validated);

  res.status(201).json({
    success: true,
    data: product,
  });
});

export const updateProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = updateProductSchema.parse(req.body);

  if (Object.keys(validated).length === 0) {
    throw new ApiError(400, 'No fields to update');
  }

  const product = await updateProduct(id, validated);

  res.json({
    success: true,
    data: product,
  });
});

export const deleteProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteProduct(id);

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});
