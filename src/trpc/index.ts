import { z } from 'zod';
import { authRouter } from './auth-router';
import { router } from './trpc';
import { paymentRouter } from './payment-router';
import { productsRouter } from './products-router';
import { bookmarkRouter } from './bookmarks-router';
import { reviewsRouter } from './reviews-router';
import { venuesRouter } from './venues-router';

export const appRouter = router({
  auth: authRouter,
  bookmarks: bookmarkRouter,
  payment: paymentRouter,
  products: productsRouter,
  reviews: reviewsRouter,
  venues: venuesRouter,
});

export type AppRouter = typeof appRouter;
