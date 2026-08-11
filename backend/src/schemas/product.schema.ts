import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  sku: z.string().min(1, 'SKU is required').max(50),
  category: z.string().min(1, 'Category is required').max(100),
  unitPrice: z.string().or(z.number()).refine(
    (val) => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return !isNaN(num) && num > 0;
    },
    'Unit price must be greater than 0'
  ),
  currentStock: z.number().int().min(0, 'Stock must be non-negative').optional().default(0),
  minStockAlert: z.number().int().min(0, 'Min stock alert must be non-negative').optional().default(0),
  location: z.string().min(1, 'Location is required').max(200),
  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial().omit({ sku: true });

export type CreateProductRequest = z.infer<typeof createProductSchema>;
export type UpdateProductRequest = z.infer<typeof updateProductSchema>;
