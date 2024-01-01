import type { CollectionConfig } from 'payload/types';

const Producers: CollectionConfig = {
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
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
  slug: 'producers',
};

export default Producers;
