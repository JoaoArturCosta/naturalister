'use client';

import AccountLayout from '@/components/AccountLayout';
import ReviewCard from '@/components/ReviewCard';
import useAuth from '@/hooks/use-auth';
import { trpc } from '@/trpc/client';

const AccountReviews = () => {
  const { user } = useAuth();

  const { data: queryResults } =
    trpc.reviews.getReviewsByUserId.useInfiniteQuery(
      {
        userId: user?.user?.id || '',
      },
      {
        getNextPageParam: lastPage => lastPage.nextPage,
      }
    );

  const reviews = queryResults?.pages.flatMap(page => page.reviews);

  return (
    <AccountLayout>
      <h2>My Reviews</h2>
      <div className="grid grid-cols-2 gap-4 pt-4">
        {reviews?.map(review => (
          <ReviewCard
            key={review.id}
            hasProductTitle
            {...review}
          />
        ))}
      </div>
    </AccountLayout>
  );
};

export default AccountReviews;
