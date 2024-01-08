'use client';

import AccountLayout from '@/components/AccountLayout';
import CollectionListing from '@/components/CollectionListing';
import useAuth from '@/hooks/use-auth';
import { trpc } from '@/trpc/client';

const AccountCollection = () => {
  const { user } = useAuth();

  const { data: bookmarksCollection } =
    trpc.bookmarks.getBookmarksCollectionByUserId.useQuery({
      userId: user?.user?.id || '',
    });

  return (
    <AccountLayout>
      <h2>My Collections</h2>
      <div className="grid grid-cols-4 gap-4 pt-4">
        {bookmarksCollection?.collection.docs?.map((collection, index) => (
          <CollectionListing
            key={collection.id}
            collection={collection}
            index={index}
          />
        ))}
      </div>
    </AccountLayout>
  );
};

export default AccountCollection;
