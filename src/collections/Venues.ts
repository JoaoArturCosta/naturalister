import { VENUE_CATEGORIES } from '../config';
import { User, Venue } from '@/payload-types';
import {
  AfterChangeHook,
  BeforeChangeHook,
} from 'payload/dist/collections/config/types';
import { Access, CollectionConfig } from 'payload/types';

const addUser: BeforeChangeHook<Venue> = async ({ req, data }) => {
  const user = req.user;

  return { ...data, user: user.id };
};

const syncUser: AfterChangeHook<Venue> = async ({ req, doc }) => {
  const fullUser = await req.payload.findByID({
    collection: 'users',
    id: req.user.id,
  });

  if (fullUser && typeof fullUser === 'object') {
    // const { venues } = fullUser;

    // const allIDs = [
    //   ...(venues?.map(venue =>
    //     typeof venue === 'object' ? venue.id : venue
    //   ) || []),
    // ];

    // const createdProductIDs = allIDs.filter(
    //   (id, index) => allIDs.indexOf(id) === index
    // );

    // const dataToUpdate = [...createdProductIDs, doc.id];

    await req.payload.update({
      collection: 'users',
      id: fullUser.id,
      data: {
        venues: doc.id,
      },
    });
  }
};

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

export const Venues: CollectionConfig = {
  slug: 'venues',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: isAdminOrHasAccess(),
    update: isAdminOrHasAccess(),
    delete: isAdminOrHasAccess(),
  },
  hooks: {
    beforeChange: [addUser],
    afterChange: [syncUser],
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
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
      name: 'category',
      label: 'Category',
      type: 'select',
      options: VENUE_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true,
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      label: 'Venue images',
      minRows: 1,
      maxRows: 4,
      required: true,
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
      name: 'location',
      label: 'Location',
      type: 'point',
    },
    {
      name: 'rating',
      label: 'Rating',
      admin: {
        readOnly: true,
      },
      access: {
        create: () => false,
        read: () => true,
        update: () => false,
      },
      type: 'number',
    },
    {
      name: 'products',
      label: 'Products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'approved',
      label: 'Venue Status',
      type: 'select',
      defaultValue: 'pending',
      access: {
        create: ({ req }) => req.user.role === 'admin',
        read: ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
      },
      options: [
        {
          label: 'Pending verification',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Denied',
          value: 'denied',
        },
      ],
    },
  ],
};
