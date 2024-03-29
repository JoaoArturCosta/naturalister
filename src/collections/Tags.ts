import type { CollectionConfig } from 'payload/types';

const Tags: CollectionConfig = {
  access: {
    delete: () => false,
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  slug: 'tags',
};

export default Tags;
