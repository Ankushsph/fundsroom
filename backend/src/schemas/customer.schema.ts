import { z } from 'zod';
import { CustomerType, CustomerStatus } from '@prisma/client';

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  mobile: z.string().regex(/^\d{10,15}$/, 'Mobile must be 10-15 digits'),
  email: z.string().email('Invalid email address'),
  businessName: z.string().min(1, 'Business name is required').max(200),
  gstNumber: z
    .string()
    .trim()
    .transform((val) => val.toUpperCase())
    .refine(
      (val) => val === '' || /^[A-Z0-9]{15}$/.test(val),
      'GST number must be 15 alphanumeric characters (e.g. 29ABCDE1234F1Z5)'
    )
    .optional()
    .nullable()
    .or(z.literal('')),
  customerType: z.enum([CustomerType.RETAIL, CustomerType.WHOLESALE, CustomerType.DISTRIBUTOR]),
  address: z.string().min(1, 'Address is required').max(1000),
  status: z.enum([CustomerStatus.LEAD, CustomerStatus.ACTIVE, CustomerStatus.INACTIVE]).default(CustomerStatus.LEAD),
  followUpDate: z.string().datetime().optional().nullable(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const createNoteSchema = z.object({
  noteText: z.string().min(1, 'Note text is required').max(5000),
});

export type CreateCustomerRequest = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerRequest = z.infer<typeof updateCustomerSchema>;
export type CreateNoteRequest = z.infer<typeof createNoteSchema>;
