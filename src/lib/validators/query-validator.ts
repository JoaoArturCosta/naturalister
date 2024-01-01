import { z } from 'zod';

export const QueryValidator = z.object({
  category: z.string().optional(),
  tag: z.string().optional(),
  sort: z.enum(['asc', 'desc', '-rating', '-createdAt']).optional(),
  limit: z.number().optional(),
  relatedProductId: z.string().optional(),
  producerId: z.string().optional(),
});

export type TQueryValidator = z.infer<typeof QueryValidator>;
