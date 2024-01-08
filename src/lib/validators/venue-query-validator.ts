import { z } from 'zod';

export const VenueQueryValidator = z.object({
  category: z.string().optional(),
  sort: z.enum(['asc', 'desc', '-rating', '-createdAt']).optional(),
  limit: z.number().optional(),
});

export type TVenueQueryValidator = z.infer<typeof VenueQueryValidator>;
