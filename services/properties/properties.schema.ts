import { z } from "zod";

// Zod Schema to parse pagination metadata fields safely
export const paginationMetaSchema = z.object({
  total: z.coerce.number().optional(),
  totalProperties: z.coerce.number().optional(),
  total_properties: z.coerce.number().optional(),
  totalItems: z.coerce.number().optional(),
  total_items: z.coerce.number().optional(),
  totalCount: z.coerce.number().optional(),
  total_count: z.coerce.number().optional(),
  count: z.coerce.number().optional(),
  
  page: z.coerce.number().optional(),
  currentPage: z.coerce.number().optional(),
  
  limit: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  
  totalPages: z.coerce.number().optional(),
  
  meta: z.object({
    total: z.coerce.number().optional(),
    totalItems: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    totalPages: z.coerce.number().optional(),
  }).partial().optional(),
  
  pagination: z.object({
    total: z.coerce.number().optional(),
  }).partial().optional(),
}).partial().passthrough();

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
