'use client';

import ImageSlider from '@/components/ImageSlider';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Bookmark, Product } from '@/payload-types';
import { trpc } from '@/trpc/client';
import { usePathname } from 'next/navigation';

const Collection = () => {
  const pathname = usePathname();

  const collectionId = pathname.split('/').pop();

  const { data: collection } =
    trpc.bookmarks.getBookmarkCollectionById.useQuery({
      id: collectionId as string,
    });

  const bookmarks = collection?.bookmarkCollection?.bookmarks as Bookmark[];

  const bookmarkedProducts = bookmarks?.map(
    bookmark => bookmark.product
  ) as Product[];

  return (
    <MaxWidthWrapper>
      <h1>Collection</h1>
      <section className="py-12 grid grid-cols-4">
        {bookmarkedProducts?.map(bookmark => {
          const validUrls = bookmark.images
            .map(({ image }) => (typeof image === 'string' ? image : image.url))
            .filter(Boolean) as string[];

          return (
            <div key={bookmark.id}>
              <ImageSlider urls={validUrls} />
              <h2>{bookmark.name}</h2>
            </div>
          );
        })}
      </section>
    </MaxWidthWrapper>
  );
};

export default Collection;
