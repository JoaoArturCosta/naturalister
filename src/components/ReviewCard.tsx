import { Product, Review, User } from '@/payload-types';
import { Rating } from '@smastrom/react-rating';
import moment from 'moment';
import React from 'react';

interface ReviewCardProps extends Review {
  hasProductTitle?: boolean;
}

const ReviewCard = (props: ReviewCardProps) => {
  const { hasProductTitle, ...review } = props;

  const userAuthor = review.author as User;
  const associatedProduct = review.replyPost as Product;

  return (
    <div
      key={review.id}
      className="relative flex flex-col overflow-hidden bg-white rounded-lg ">
      <div className="flex-1">
        <div className="flex flex-col  ">
          <span className=" font-medium ">
            {!hasProductTitle
              ? `${userAuthor?.firstName || ''} ${userAuthor?.lastName}`
              : associatedProduct?.name}
          </span>
          <span className="font-light">
            {!hasProductTitle ? userAuthor?.country : null}
          </span>
        </div>
        <div className="flex items-center gap-1 pt-4 ">
          <Rating
            style={{ maxWidth: 70 }}
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
