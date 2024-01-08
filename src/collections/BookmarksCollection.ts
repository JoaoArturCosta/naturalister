// import { BookmarksCollection } from '@/payload-types';
// import payload from 'payload';
// import { BeforeChangeHook } from 'payload/dist/collections/config/types';
import { CollectionConfig } from 'payload/types';

// const addImage: BeforeChangeHook<BookmarksCollection> = async ({
//   req,
//   data,
// }) => {
//   const bookmarksCollection = await payload.findByID({
//     collection: 'bookmarksCollection',
//     id: data.id as string,
//   });

//   const bookmark = await payload.findByID({
//     collection: 'bookmarks',
//     id: bookmarksCollection?.bookmarks?.[0] as string,
//   });

//   const product = await payload.findByID({
//     collection: 'products',
//     id: bookmark?.product as string,
//   });

//   const validUrls = product.images
//     .map(({ image }) => (typeof image === 'string' ? image : image.url))
//     .filter(Boolean) as string[];

//   const image = validUrls[0];

//   await req.payload.update({
//     collection: 'bookmarksCollection',
//     id: data.id as string,
//     data: {
//       image,
//     },
//   });
// };

export const BookmarksCollections: CollectionConfig = {
  slug: 'bookmarksCollection',
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'bookmarks',
      relationTo: 'bookmarks',
      type: 'relationship',
      hasMany: true,
      required: true,
    },
    {
      name: 'user',
      relationTo: 'users',
      type: 'relationship',
      hasMany: false,
      required: true,
    },
    {
      name: 'image',
      type: 'text',
    },
  ],
  hooks: {
    // beforeChange: [addImage],
  },
};
