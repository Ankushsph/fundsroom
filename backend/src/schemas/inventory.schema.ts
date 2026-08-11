import { z } from 'zod';

export const stockInSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  reason: z.string().min(1, 'Reason is required').max(1000),
});

export const stockOutSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  reason: z.string().min(1, 'Reason is required').max(1000),
});

export type StockInRequest = z.infer<typeof stockInSchema>;
export type StockOutRequest = z.infer<typeof stockOutSchema>;
