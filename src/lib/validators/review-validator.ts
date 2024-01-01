import * as z from 'zod';

export const ReviewValidator = z.object({
  id: z.string(),
  author: z.string(),
  review: z
    .string()
    .min(2, { message: 'Review must be at least 100 characters long.' }),
  rating: z.number(),
});

export type TReviewValidator = z.infer<typeof ReviewValidator>;
