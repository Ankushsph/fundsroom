import { z } from 'zod';

export const createChallanItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const createChallanSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  items: z
    .array(createChallanItemSchema)
    .min(1, 'At least one item is required')
    .refine(
      (items) => new Set(items.map((i) => i.productId)).size === items.length,
      'Duplicate products are not allowed in a challan'
    ),
});

export const updateChallanSchema = z.object({
  items: z
    .array(createChallanItemSchema)
    .min(1, 'At least one item is required')
    .refine(
      (items) => new Set(items.map((i) => i.productId)).size === items.length,
      'Duplicate products are not allowed in a challan'
    ),
});

export type CreateChallanItemRequest = z.infer<typeof createChallanItemSchema>;
export type CreateChallanRequest = z.infer<typeof createChallanSchema>;
export type UpdateChallanRequest = z.infer<typeof updateChallanSchema>;
