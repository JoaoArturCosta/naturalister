import React from 'react';
import { Skeleton } from './ui/skeleton';

const ReviewSkeleton = () => {
  return (
    <div className="flex flex-col  gap-4">
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[300px]" />
    </div>
  );
};

export default ReviewSkeleton;
