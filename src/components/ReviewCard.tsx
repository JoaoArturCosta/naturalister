import { Review } from '@/payload-types';
import { Rating } from '@smastrom/react-rating';
import moment from 'moment';
import React from 'react';

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div
      key={review.id}
      className="relative flex flex-col overflow-hidden bg-white rounded-lg ">
      <div className="flex-1">
        <span className=" font-medium ">{review.author}</span>
        <div className="flex items-center gap-1 ">
          <Rating
            style={{ maxWidth: 100 }}
            value={review.rating || 0}
            readOnly
          />
          <span>&#183;</span>
          <span className="text-sm font-medium">
            {moment(review.createdAt).fromNow()}
          </span>
        </div>
        <div className="pt-2 font-normal ">{review.content}</div>
      </div>
    </div>
  );
};
export default ReviewCard;
