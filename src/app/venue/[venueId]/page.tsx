import ImageSlider from '@/components/ImageSlider';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Separator } from '@/components/ui/separator';
import { VENUE_CATEGORIES } from '@/config';
import { getPayloadClient } from '@/get-payload';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface VenuePageProps {
  params: {
    venueId: string;
  };
}

const BREADCRUMBS = [
  { id: 1, name: 'Home', href: '/' },
  { id: 2, name: 'Venues', href: '/venues' },
];

const VenuePage = async ({ params }: VenuePageProps) => {
  const { venueId } = params;

  const payload = await getPayloadClient();

  const { docs: venues } = await payload.find({
    collection: 'venues',
    limit: 1,
    where: {
      id: {
        equals: venueId,
      },
      approved: {
        equals: 'approved',
      },
    },
  });

  const { docs: reviews } = await payload.find({
    collection: 'reviews',
    where: {
      replyPost: {
        equals: venueId,
      },
    },
  });

  const { docs: events } = await payload.find({
    collection: 'events',
    where: {
      venue: {
        equals: venueId,
      },
    },
  });

  const nextEvent = events.find(event => {
    const eventDate = new Date(event.date);
    const now = new Date();

    return eventDate > now;
  });

  const previousEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();

    return eventDate < now;
  });

  const averageRating =
    reviews.reduce((acc, { rating }) => acc + (rating || 0), 0) /
      reviews.length || 0;

  const [venue] = venues;

  if (!venue) return notFound();

  const label = VENUE_CATEGORIES.find(
    ({ value }) => value === venue.category
  )?.label;

  const validUrls = venue.images
    .map(({ image }) => (typeof image === 'string' ? image : image.url))
    .filter(Boolean) as string[];

  const eventValidUrls = (nextEvent?.images || [])
    .map(({ image }) => (typeof image === 'string' ? image : image.url))
    .filter(Boolean) as string[];

  return (
    <MaxWidthWrapper className="bg-white">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product Details */}
          <div className="lg:max-w-lg lg:self-end">
            <ol className="flex items-center space-x-2">
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className="flex items-center text-sm">
                    <Link
                      href={breadcrumb.href}
                      className="font-medium text-sm text-muted-foreground hover:text-gray-900">
                      {breadcrumb.name}
                    </Link>
                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300">
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {venue.name}
              </h1>
            </div>

            <section className="mt-4">
              <div className="flex items-center">
                <p className=" flex gap-2 font-semibold text-gray-900">
                  {/* <Rating
                    readOnly
                    value={averageRating}
                    style={{ maxWidth: 80 }}
                  /> */}
                  <span>{averageRating.toFixed(2) || 0}</span>
                </p>

                <div className="ml-4 border-l text-muted-foreground border-gray-300 pl-4">
                  {label}
                </div>

                {/* <div className="ml-4 text-muted-foreground">
                  <BookmarkDialog venueId={venueId} />
                </div> */}
              </div>

              <div className="mt-4 space-y-6">
                <p className="text-base text-muted-foreground">
                  {venue.address}
                </p>
                <p className="text-base ">{venue.description}</p>
              </div>

              <div className="mt-4 flex flex-col gap-2 pb-4"></div>
              <Separator />

              {/* <div className="mt-6 flex items-center">
                <Check
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-green-500"
                />
                <p className="ml-2 text-sm text-muted-foreground">
                  Eligible for instant delivery
                </p>
              </div> */}
              {/* <Accordion
                type="single"
                collapsible
                className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Producer Notes</AccordionTrigger>
                  <AccordionContent>
                    <p className="mt-4 text-base text-muted-foreground">
                      {producer?.notes}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion> */}
            </section>
          </div>

          {/* Product images */}
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-square rounded-lg">
              <ImageSlider urls={validUrls} />
            </div>
          </div>

          {/* add to cart part */}
          {/* <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <div>
              <div className="mt-10">
                <AddToCartButton product={product} />
              </div>
              <div className="mt-6 text-center">
                <div className="group inline-flex text-sm text-medium">
                  <Shield
                    aria-hidden="true"
                    className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400"
                  />
                  <span className="text-muted-foreground hover:text-gray-700">
                    30 Day Return Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {nextEvent && (
        <>
          <Separator />
          <section className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">Next Event</h3>
            <div className="mt-8 lg:grid lg:grid-cols-8 lg:max-w-7xl lg:gap-12 py-4">
              <div className="lg:col-span-3 lg:self-center">
                <div className="aspect-square rounded-lg">
                  <ImageSlider urls={eventValidUrls} />
                </div>
              </div>
              <div className="flex flex-col lg:col-span-5">
                <p className="text-xl font-bold ">{nextEvent?.name}</p>
                <p className="text-muted-foreground mt-1">
                  {format(new Date(nextEvent?.date || 0), 'dd MMM yy')}
                </p>
                <p className="mt-6 max-w-lg">{nextEvent?.description}</p>
              </div>
            </div>
          </section>
        </>
      )}
      {previousEvents.length > 0 && (
        <>
          <section className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Previous Events
            </h3>
            <div className="relative">
              <div className="mt-6 flex items-center w-full">
                <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
                  {previousEvents.map(event => (
                    <div key={event.id}>
                      <div className="flex flex-col w-full">
                        <ImageSlider urls={validUrls} />

                        <h3 className="mt-4 font-medium text-sm text-gray-700">
                          {venue.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <Separator />
        </>
      )}

      {/* <ReviewsForm venueId={venueId} />

      <ReviewReel
        query={{ limit: 5, sort: '-createdAt', relatedProductId: venueId }}
      /> */}
      <Separator />
      {/* <ProductReel
        href="/venues"
        query={{
          category: product.category,
          producerId: producer?.id,
          limit: 4,
        }}
        title={`Similar ${label}`}
        subtitle={`Browse similar high-quality ${label} just like '${product.name}'`}
      /> */}
    </MaxWidthWrapper>
  );
};

export default VenuePage;
