import { Bookmark } from '@/payload-types';
import { getPayloadClient } from '../get-payload';
import { publicProcedure, router } from './trpc';
import { z } from 'zod';

export const bookmarkRouter = router({
  createBookmarksCollection: publicProcedure
    .input(
      z.object({
        title: z.string(),
        userId: z.string(),
        productId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { title, userId, productId } = input;

      const payload = await getPayloadClient();

      const createdBookmark = await payload.create({
        collection: 'bookmarks',
        data: {
          product: productId,
          user: userId,
        },
      });

      const created = await payload.create({
        collection: 'bookmarksCollection',
        data: {
          title,
          bookmarks: [createdBookmark.id],
          user: userId,
        },
      });

      return { sucess: true, created };
    }),

  getBookmarkByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        productId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { userId, productId } = input;

      const payload = await getPayloadClient();

      const bookmark = await payload.find({
        collection: 'bookmarks',
        where: {
          user: {
            equals: userId,
          },
          product: {
            equals: productId,
          },
        },
      });

      return bookmark;
    }),

  deleteBookmark: publicProcedure
    .input(
      z.object({
        id: z.string(),
        bookmarkCollectionId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;

      const payload = await getPayloadClient();

      const deleted = await payload.delete({
        collection: 'bookmarks',
        id: id,
      });

      const bookmarkCollection = await payload.findByID({
        collection: 'bookmarksCollection',
        id: input.bookmarkCollectionId,
      });

      const updated = await payload.update({
        collection: 'bookmarksCollection',
        id: input.bookmarkCollectionId,
        data: {
          bookmarks: [
            ...(bookmarkCollection?.bookmarks as Bookmark[]).filter(
              bookmark => bookmark.id !== id
            ),
          ],
        },
      });

      return { success: true };
    }),

  getBookmarksCollectionByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { userId } = input;

      const payload = await getPayloadClient();

      const bookmarksCollection = await payload.find({
        collection: 'bookmarksCollection',
        where: {
          user: {
            equals: userId,
          },
        },
      });

      return { collection: bookmarksCollection };
    }),

  postBookmark: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        productId: z.string(),
        bookmarkcollectionId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, productId, bookmarkcollectionId } = input;

      const payload = await getPayloadClient();

      const createdBookmark = await payload.create({
        collection: 'bookmarks',
        data: {
          product: productId,
          user: userId,
        },
      });

      const bookmarkCollection = await payload.findByID({
        collection: 'bookmarksCollection',
        id: bookmarkcollectionId,
      });

      const updated = await payload.update({
        collection: 'bookmarksCollection',
        id: bookmarkcollectionId,
        data: {
          bookmarks: [
            ...(bookmarkCollection?.bookmarks as Bookmark[]),
            createdBookmark.id,
          ],
        },
      });

      return { sucess: true, updated };
    }),
});
