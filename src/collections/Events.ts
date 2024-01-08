import { User } from '@/payload-types';
import { Access, CollectionConfig } from 'payload/types';

const isAdminOrHasAccess =
  (): Access =>
  ({ req: { user: _user } }) => {
    const user = _user as User | undefined;

    if (!user) return false;
    if (user.role === 'admin') return true;

    const userVenueId =
      typeof user.venues === 'string' ? user.venues : user.venues?.id;

    return {
      id: {
        equals: userVenueId,
      },
    };
  };

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: isAdminOrHasAccess(),
    update: isAdminOrHasAccess(),
    delete: isAdminOrHasAccess(),
  },
  fields: [
    {
      name: 'name',
      label: 'Event Name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
    },
    {
      name: 'venue',
      label: 'Venue',
      type: 'relationship',
      relationTo: 'venues',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      label: 'Venue images',
      minRows: 1,
      maxRows: 4,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'price',
      label: 'Price',
      type: 'text',
    },
  ],
};
