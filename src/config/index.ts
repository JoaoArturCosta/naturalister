export const PRODUCT_CATEGORIES = [
  {
    label: 'Wines',
    value: 'wines' as const,
    featured: [
      {
        name: 'Editor picks',
        href: `/products?category=ui_kits`,
        imageSrc: '/nav/ui-kits/mixed.jpg',
      },
      {
        name: 'New Additions',
        href: '/products?category=wines&sort=desc',
        imageSrc: '/nav/ui-kits/blue.jpg',
      },
      {
        name: 'Top rated',
        href: '/products?category=wines',
        imageSrc: '/nav/ui-kits/purple.jpg',
      },
    ],
  },
];

export const VENUE_CATEGORIES = [
  {
    label: 'Bars',
    value: 'bars' as const,
    featured: [
      {
        name: 'Editor picks',
        href: `/venues?category=bars`,
        imageSrc: '/nav/ui-kits/mixed.jpg',
      },
      {
        name: 'New Additions',
        href: '/venues?category=bars&sort=desc',
        imageSrc: '/nav/ui-kits/blue.jpg',
      },
      {
        name: 'Top rated',
        href: '/venues?category=bars',
        imageSrc: '/nav/ui-kits/purple.jpg',
      },
    ],
  },
  {
    label: 'Restaurants',
    value: 'restaurants' as const,
    featured: [
      {
        name: 'Favorite Icon Picks',
        href: `/venues?category=restaurants`,
        imageSrc: '/nav/icons/picks.jpg',
      },
      {
        name: 'New Arrivals',
        href: '/venues?category=restaurants&sort=desc',
        imageSrc: '/nav/icons/new.jpg',
      },
      {
        name: 'Bestselling Icons',
        href: '/venues?category=restaurants',
        imageSrc: '/nav/icons/bestsellers.jpg',
      },
    ],
  },
  {
    label: 'Shops',
    value: 'shops' as const,
    featured: [
      {
        name: 'Favorite Icon Picks',
        href: `/venues?category=shops`,
        imageSrc: '/nav/icons/picks.jpg',
      },
      {
        name: 'New Arrivals',
        href: '/venues?category=shops&sort=desc',
        imageSrc: '/nav/icons/new.jpg',
      },
      {
        name: 'Bestselling Icons',
        href: '/venues?category=shops',
        imageSrc: '/nav/icons/bestsellers.jpg',
      },
    ],
  },
];
