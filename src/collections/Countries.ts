import { CollectionConfig } from 'payload/types';

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'code',
      type: 'text',
      label: 'Code',
      required: true,
    },
    {
      name: 'flag',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
};
