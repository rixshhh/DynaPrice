import { z } from 'next/dist/compiled/zod';

export const sortableFields = ['name', 'price', 'category', 'createdAt', 'updatedAt'] as const;

export type SortableField = (typeof sortableFields)[number];

export type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  currency: string;
  category: string;
  sellerId: string;
  stock: number;
  isPublished: boolean;
};

export type UpdateProductInput = Partial<Omit<CreateProductInput, 'sellerId'>>;

export type ListProductsQuery = {
  page: number;
  pageSize: number;
  sortBy: SortableField;
  sortOrder: 'asc' | 'desc';
  category?: string;
  sellerId?: string;
};

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(2000).optional(),
  price: z.number().finite().nonnegative(),
  currency: z.string().trim().length(3).transform((value: string) => value.toUpperCase()),
  category: z.string().trim().min(1).max(80),
  sellerId: z.string().trim().min(1),
  stock: z.number().int().nonnegative(),
  isPublished: z.boolean().optional().default(false),
});

export const updateProductSchema = createProductSchema
  .omit({ sellerId: true })
  .partial()
  .refine((value: UpdateProductInput) => Object.keys(value).length > 0, {
    message: 'Provide at least one field to update.',
  });

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(sortableFields).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  category: z.string().trim().min(1).optional(),
  sellerId: z.string().trim().min(1).optional(),
});

