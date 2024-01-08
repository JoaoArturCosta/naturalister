import { Bookmark, Product } from '@/payload-types';
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

      const product = createdBookmark.product as Product;

      const validUrls = product.images
        .map(({ image }) => (typeof image === 'string' ? image : image.url))
        .filter(Boolean) as string[];

      const created = await payload.create({
        collection: 'bookmarksCollection',
        data: {
          title,
          bookmarks: [createdBookmark.id],
          user: userId,
          image: validUrls[0],
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

      const bookmarksArr = bookmarkCollection?.bookmarks as Bookmark[];
      const updatedBookmarks = bookmarksArr?.filter(
        bookmark => bookmark.id !== id
      );

      const updated = await payload.update({
        collection: 'bookmarksCollection',
        id: input.bookmarkCollectionId,
        data: {
          bookmarks: updatedBookmarks?.map(({ id }) => id as string),
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

      const bookmarksArr = bookmarkCollection?.bookmarks as Bookmark[];

      const bookmarkIds = bookmarksArr?.flatMap(({ id }) => id as string);

      const updated = await payload.update({
        collection: 'bookmarksCollection',
        id: bookmarkcollectionId,
        data: {
          bookmarks: [...(bookmarkIds as string[]), createdBookmark.id],
        },
      });

      return { sucess: true, updated };
    }),

  getBookmarkCollectionById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;

      const payload = await getPayloadClient();

      const bookmarkCollection = await payload.findByID({
        collection: 'bookmarksCollection',
        id: id,
      });

      // const bookmarksArr = bookmarkCollection?.bookmarks as Bookmark[];

      // const bookmarkIds = bookmarksArr?.flatMap(({ id }) => id as string);

      // const { docs: bookmarks } = await payload.find({
      //   collection: 'bookmarks',
      //   where: {
      //     id: {
      //       in: bookmarkIds as string[],
      //     },
      //   },
      // });

      return { bookmarkCollection };
    }),
});
