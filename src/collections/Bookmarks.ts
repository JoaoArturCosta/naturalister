import { CollectionConfig } from 'payload/types';

export const Bookmarks: CollectionConfig = {
  slug: 'bookmarks',
  access: {
    create: () => true,
    read: () => true,
    update: () => false,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      hasMany: false,
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      required: true,
    },
  ],
};
