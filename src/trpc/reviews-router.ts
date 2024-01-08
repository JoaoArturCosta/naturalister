import { publicProcedure, router } from './trpc';
import { getPayloadClient } from '../get-payload';
import { z } from 'zod';
import { QueryValidator } from '../lib/validators/query-validator';

export const reviewsRouter = router({
  postReview: publicProcedure
    .input(
      z.object({
        id: z.string(),
        author: z.string(),
        review: z.string(),
        rating: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { author, id, review, rating } = input;

      const payload = await getPayloadClient();

      const created = await payload.create({
        collection: 'reviews',
        data: {
          author: author,
          content: review,
          rating,
          replyPost: id,
          isApproved: true,
        },
      });

      return { success: true };
    }),

  getUserProductReview: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        productId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { userId, productId } = input;

      const payload = await getPayloadClient();

      const { docs: reviews } = await payload.find({
        collection: 'reviews',
        where: {
          replyPost: {
            equals: productId,
          },
          author: {
            equals: userId,
          },
        },
      });

      return reviews[0];
    }),

  getInfiniteReviews: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input;
      const { sort, limit, relatedProductId, ...queryOpts } = query;

      const payload = await getPayloadClient();

      const parsedQueryOpts: Record<string, { equals: string }> = {};

      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOpts[key] = {
          equals: value,
        };
      });

      const page = cursor || 1;

      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: 'reviews',
        where: {
          isApproved: {
            equals: true,
          },
          replyPost: {
            equals: relatedProductId,
          },
          ...parsedQueryOpts,
        },
        sort,
        depth: 1,
        limit,
        page,
      });

      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
  getReviewsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ input }) => {
      const { userId, cursor } = input;

      const payload = await getPayloadClient();

      const page = cursor || 1;

      const {
        docs: reviews,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: 'reviews',
        where: {
          author: {
            equals: userId,
          },
        },
        sort: 'desc',
        depth: 1,
        limit: 10,
        page,
      });

      return { reviews, nextPage: hasNextPage ? nextPage : null };
    }),
});
