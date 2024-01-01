import { z } from 'zod';

export const BookmarksCollectionValidator = z.object({
  title: z.string(),
  userId: z.string(),
  productId: z.string(),
});

export type TBookmarksCollectionValidator = z.infer<
  typeof BookmarksCollectionValidator
>;
