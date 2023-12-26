import { CollectionConfig } from 'payload/types';

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  fields: [
    {
      name: 'author',
      type: 'text',
    },
    {
      name: 'rating',
      type: 'number',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'content',
      type: 'textarea',
    },
    {
      name: 'replyPost',
      type: 'relationship',
      relationTo: 'products',
    },
    {
      name: 'replyComment',
      type: 'relationship',
      relationTo: 'reviews',
    },
    {
      name: 'isApproved',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
};
