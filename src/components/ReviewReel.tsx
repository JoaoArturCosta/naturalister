'use client';

import { TQueryValidator } from '@/lib/validators/query-validator';
import { Review } from '@/payload-types';
import { trpc } from '@/trpc/client';
import ReviewCard from './ReviewCard';
import ReviewsDialog from './ReviewsDialog';
import ReviewSkeleton from './ReviewSkeleton';
import { useMemo } from 'react';
import { StarFilledIcon } from '@radix-ui/react-icons';

interface ReviewReelProps {
  query: TQueryValidator;
}

const FALLBACK_LIMIT = 4;

const ReviewReel = (props: ReviewReelProps) => {
  const { query } = props;

  const { data: queryResults, isLoading } =
    trpc.reviews.getInfiniteReviews.useInfiniteQuery(
      {
        limit: FALLBACK_LIMIT,
        query,
      },
      {
        getNextPageParam: lastPage => lastPage.nextPage,
      }
    );

  const reviews = queryResults?.pages.flatMap(page => page.items);

  const averageRating = useMemo(() => {
    if (!reviews) return 0;

    return (
      reviews.reduce((acc, { rating }) => acc + (rating || 0), 0) /
      reviews.length
    );
  }, [reviews]);

  let map: (Review | null)[] = [];

  if (reviews && reviews.length) {
    map = reviews;
  } else if (isLoading) {
    map = new Array<null>(FALLBACK_LIMIT).fill(null);
  }

  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <h1 className="flex gap-2 text-2xl font-bold text-gray-900 ">
            {!averageRating ? null : (
              <>
                <span className="flex items-center gap-1 ">
                  <StarFilledIcon />
                  {averageRating.toFixed(2)}
                </span>
                <span>&#183;</span>
              </>
            )}
            {reviews?.length === 0
              ? 'Be the first to review this product'
              : `${reviews?.length} ${
                  reviews?.length === 1 ? 'review' : 'reviews'
                }`}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 py-6 ">
        {map.map((review, i) => {
          if (!review) {
            return <ReviewSkeleton key={i} />;
          }

          return (
            <ReviewCard
              key={review.id}
              {...review}
            />
          );
        })}
      </div>

      <ReviewsDialog productId={query.relatedProductId || ''} />
    </section>
  );
};

export default ReviewReel;
