'use client';

import { trpc } from '@/trpc/client';
import { Button, buttonVariants } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useState } from 'react';
import {
  QueryValidator,
  TQueryValidator,
} from '@/lib/validators/query-validator';
import { Review } from '@/payload-types';
import ReviewCard from './ReviewCard';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import ReviewSkeleton from './ReviewSkeleton';

interface ReviewsDialogProps {
  productId: string;
}

const FALLBACK_LIMIT = 100;

const ReviewsDialog = (props: ReviewsDialogProps) => {
  const { productId } = props;

  const [query, setQuery] = useState<TQueryValidator>({
    limit: FALLBACK_LIMIT,
    sort: '-createdAt',
    relatedProductId: productId,
  });

  const handleSelectChange = (value: string) => {
    const sortValue = value as TQueryValidator['sort'];
    setQuery({ ...query, sort: sortValue });
    refetch();
  };

  const {
    data: queryResults,
    isLoading,
    refetch,
  } = trpc.getInfiniteReviews.useInfiniteQuery(
    {
      limit: FALLBACK_LIMIT,
      query,
    },
    {
      getNextPageParam: lastPage => lastPage.nextPage,
    }
  );

  const reviews = queryResults?.pages.flatMap(page => page.items);

  let map: (Review | null)[] = [];

  if (reviews && reviews.length) {
    map = reviews;
  } else if (isLoading) {
    map = new Array<null>(FALLBACK_LIMIT).fill(null);
  }
  return (
    <div className="mt-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className={buttonVariants({ variant: 'outline' })}>
            Check all reviews
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reviews</DialogTitle>
            <DialogDescription>Check what others are saying</DialogDescription>
            <div className="self-end mt-0">
              <Select
                defaultValue="-createdAt"
                onValueChange={handleSelectChange}
                value={query.sort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      key="-createdAt"
                      value="-createdAt">
                      Most Recent
                    </SelectItem>
                    <SelectItem
                      key="-rating"
                      value="-rating">
                      Highest Rated
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </DialogHeader>
          <div className="mt-0 flex flex-col">
            <div className="w-full mt-4">
              <div className="flex flex-col gap-6">
                {map.map((review, i) => {
                  if (!review) {
                    return <ReviewSkeleton key={i} />;
                  }
                  return (
                    <>
                      <ReviewCard
                        key={review.id}
                        review={review}
                      />
                      {i < map.length - 1 ? <Separator /> : null}
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsDialog;
