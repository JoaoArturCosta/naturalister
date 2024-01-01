import { buildConfig } from 'payload/config';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import path from 'path';
import { Users } from './collections/Users';
import dotenv from 'dotenv';
import { Products } from './collections/Products/Products';
import { Media } from './collections/Media';
import { ProductFiles } from './collections/ProductFile';
import comments from 'payload-plugin-comments';
import { Orders } from './collections/Orders';
import Tags from './collections/Tags';
import { Countries } from './collections/Countries';
import Producers from './collections/Producers';
import { Bookmarks } from './collections/Bookmarks';
import { BookmarksCollections } from './collections/BookmarksCollection';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  collections: [
    Users,
    Products,
    Media,
    ProductFiles,
    Orders,
    Tags,
    Countries,
    Producers,
    Bookmarks,
    BookmarksCollections,
  ],
  routes: {
    admin: '/contribute',
  },
  admin: {
    user: 'users',
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- NaturaLister',
      favicon: '/favicon.ico',
      ogImage: '/thumbnail.jpg',
    },
  },
  rateLimit: {
    max: 2000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  plugins: [
    comments({
      slug: 'reviews',
      singularLabel: 'review',
      fields: [
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'rating',
          type: 'number',
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
    }),
  ],
});
