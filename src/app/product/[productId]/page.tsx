import AddToCartButton from '@/components/AddToCartButton';
import BookmarkDialog from '@/components/BookmarkDialog';
import ImageSlider from '@/components/ImageSlider';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import ProductReel from '@/components/ProductReel';
import ReviewReel from '@/components/ReviewReel';
import ReviewsForm from '@/components/ReviewsForm';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PRODUCT_CATEGORIES } from '@/config';
import { getPayloadClient } from '@/get-payload';
import { Country, Producer, Tag } from '@/payload-types';
import { Rating } from '@smastrom/react-rating';
import { Check, Shield } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    productId: string;
  };
}

const BREADCRUMBS = [
  { id: 1, name: 'Home', href: '/' },
  { id: 2, name: 'Wines', href: '/products?category=wines' },
];

const Page = async ({ params }: PageProps) => {
  const { productId } = params;

  const payload = await getPayloadClient();

  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 1,
    where: {
      id: {
        equals: productId,
      },
      approvedForSale: {
        equals: 'approved',
      },
    },
  });

  const { docs: reviews } = await payload.find({
    collection: 'reviews',
    where: {
      replyPost: {
        equals: productId,
      },
    },
  });

  const averageRating =
    reviews.reduce((acc, { rating }) => acc + (rating || 0), 0) /
      reviews.length || 0;

  const [product] = products;

  const producer = product.producer as Producer;

  const country = product.country as Country;

  const tags = product.tags as Tag[];

  if (!product) return notFound();

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  const validUrls = product.images
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
              <Link href={`/products?producerId=${producer?.id}`}>
                <h4 className="font-light underline underline-offset-8 decoration-stone-200 decoration-1 pb-6">
                  {producer?.title}
                </h4>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <section className="mt-4">
              <div className="flex items-center">
                <p className=" flex gap-2 font-semibold text-gray-900">
                  <Rating
                    readOnly
                    value={averageRating}
                    style={{ maxWidth: 80 }}
                  />
                  <span>{averageRating.toFixed(2) || 0}</span>
                </p>

                <div className="ml-4 border-l text-muted-foreground border-gray-300 pl-4">
                  {label}
                </div>

                <div className="ml-4 text-muted-foreground">
                  <BookmarkDialog productId={productId} />
                </div>
              </div>
              <div className="mt-4 flex gap-2 items-center flex-wrap">
                {tags?.map(({ title }) => (
                  <Link
                    key={title}
                    href={`/products?tag=${title}`}
                    className="text-sm font-medium underline underline-offset-2">
                    {title}
                  </Link>
                ))}
              </div>

              <div className="mt-4 space-y-6">
                <p className="text-base text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2 ">
                {!!country && (
                  <p className="font-normal">Country: {country?.name}</p>
                )}

                {!!product?.region && (
                  <p className="font-normal">Region: {product?.region}</p>
                )}

                {!!product?.grape && (
                  <p className="font-normal">Grape: {product?.grape}</p>
                )}

                {!!product?.color && (
                  <p className="font-normal">Colour: {product?.color}</p>
                )}

                {!!product?.alcohol && (
                  <p className="font-normal">Alcohol: {product?.alcohol}</p>
                )}

                {!!product?.vintage && (
                  <p className="font-normal">Vintage: {product?.vintage}</p>
                )}
              </div>

              {/* <div className="mt-6 flex items-center">
                <Check
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-green-500"
                />
                <p className="ml-2 text-sm text-muted-foreground">
                  Eligible for instant delivery
                </p>
              </div> */}
              <Accordion
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
              </Accordion>
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
      <Separator />

      <ReviewsForm productId={productId} />

      <ReviewReel
        query={{ limit: 5, sort: '-createdAt', relatedProductId: productId }}
      />
      <Separator />
      <ProductReel
        href="/products"
        query={{
          category: product.category,
          producerId: producer?.id,
          limit: 4,
        }}
        title={`Similar ${label}`}
        subtitle={`Browse similar high-quality ${label} just like '${product.name}'`}
      />
    </MaxWidthWrapper>
  );
};

export default Page;
