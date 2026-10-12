import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(255)
      .trim()
      .optional(),
    email: z
      .string()
      .email('Please enter a valid email address')
      .max(255)
      .toLowerCase()
      .trim()
      .optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
