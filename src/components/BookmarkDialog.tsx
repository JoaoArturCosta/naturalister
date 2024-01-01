'use client';

import { HeartIcon, Plus } from 'lucide-react';
import { Button, buttonVariants } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  BookmarksCollectionValidator,
  TBookmarksCollectionValidator,
} from '@/lib/validators/bookmarksCollection-validator';
import { useForm } from 'react-hook-form';
import useAuth from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { use, useEffect, useState } from 'react';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import SignInForm from './SignInForm';

interface BookmarkDialogProps {
  productId: string;
}

const BookmarkDialog = (props: BookmarkDialogProps) => {
  const { productId } = props;

  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const form = useForm<TBookmarksCollectionValidator>({
    resolver: zodResolver(BookmarksCollectionValidator),
    defaultValues: {
      title: '',
      userId: user?.user?.id || '',
      productId: productId || '',
    },
  });

  const { mutate: createBookmarksCollection, isLoading } =
    trpc.bookmarks.createBookmarksCollection.useMutation({
      onSuccess: async ({ created }) => {
        setOpen(false);
        toast.success(`Created ${created?.title}`);

        form.reset();
      },
      onError: error => {
        toast.error(
          'An error occurred while creating your collection. Please try again.'
        );
      },
    });

  const { data: bookmark } = trpc.bookmarks.getBookmarkByUserId.useQuery({
    userId: user?.user?.id || '',
    productId: productId,
  });

  const { mutate: deleteBookmark, isLoading: deleteIsLoading } =
    trpc.bookmarks.deleteBookmark.useMutation({
      onSuccess: async () => {
        setOpen(false);
        setIsBookmarked(false);
        toast.success('Removed');
      },
      onError: error => {
        toast.error(
          'An error occurred while deleting your bookmark. Please try again.'
        );
      },
    });

  const { data: bookmarksCollection } =
    trpc.bookmarks.getBookmarksCollectionByUserId.useQuery({
      userId: user?.user?.id || '',
    });

  const { mutate: addBookmark } = trpc.bookmarks.postBookmark.useMutation({
    onSuccess: async ({ updated }) => {
      setOpen(false);
      toast.success(`Saved to ${updated?.title}`);
    },
    onError: error => {
      toast.error(
        'An error occurred while adding your bookmark. Please try again.'
      );
    },
  });

  useEffect(() => {
    if (bookmark?.totalDocs || 0 > 0) {
      setIsBookmarked(true);
    } else {
      setIsBookmarked(false);
    }
  }, [bookmark]);

  const handleButtonClick = () => {
    if (isBookmarked) {
      deleteBookmark({
        id: bookmark?.docs[0].id || '',
        bookmarkCollectionId: bookmarksCollection?.collection.docs[0].id || '',
      });
      return;
    }
  };

  const onSubmit = (values: TBookmarksCollectionValidator) => {
    createBookmarksCollection(values);
  };

  if (openCreate)
    return (
      <Dialog
        open={openCreate}
        onOpenChange={setOpenCreate}>
        <DialogTrigger>
          <div
            className="flex flex-col gap-2"
            role="presentation">
            <div className="flex gap-6 items-center">
              <div className=" flex items-center justify-center w-[64px] h-[64px] rounded-lg border-slate-300 border-solid border p-2">
                <Plus className="w-[32px] h-[32px]" />
              </div>
              <div>Create New Collection</div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Name this collection
            </DialogTitle>
          </DialogHeader>
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="mt-4"
                disabled={isLoading}
                type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );

  if (isBookmarked)
    return (
      <Button
        className={buttonVariants({
          variant: 'ghost',
          size: 'xs',
        })}
        disabled={deleteIsLoading}
        onClick={handleButtonClick}>
        <HeartIcon
          color={isBookmarked ? '#4c1d90' : '#000000'}
          className="w-[16px] h-[16px]"
        />
        <span
          className={cn('underline underline-1 pl-1', {
            'text-violet-900 no-underline': isBookmarked,
          })}>
          {isBookmarked ? 'Saved' : 'Save'}
        </span>
      </Button>
    );

  if (!user?.token)
    return (
      <Dialog>
        <DialogTrigger>
          <Button
            className={buttonVariants({
              variant: 'ghost',
              size: 'xs',
            })}>
            <HeartIcon
              color={isBookmarked ? '#4c1d90' : '#000000'}
              className="w-[16px] h-[16px]"
            />
            <span
              className={cn('underline underline-1 pl-1', {
                'text-violet-900 no-underline': isBookmarked,
              })}>
              {isBookmarked ? 'Saved' : 'Save'}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Sign in to save</DialogTitle>
          </DialogHeader>
          <Separator />
          <SignInForm />
        </DialogContent>
      </Dialog>
    );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          className={buttonVariants({
            variant: 'ghost',
            size: 'xs',
          })}
          disabled={deleteIsLoading}>
          <HeartIcon
            color={isBookmarked ? '#4c1d90' : '#000000'}
            className="w-[16px] h-[16px]"
          />
          <span
            className={cn('underline underline-1 pl-1', {
              'text-violet-900 no-underline': isBookmarked,
            })}>
            {isBookmarked ? 'Saved' : 'Save'}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Your Collections</DialogTitle>
        </DialogHeader>
        <Separator />
        <div
          className="flex flex-col gap-2"
          role="presentation"
          onClick={() => setOpenCreate(true)}>
          <div className="flex gap-6 items-center">
            <div className=" flex items-center justify-center w-[64px] h-[64px] rounded-lg border-slate-300 border-solid border p-2">
              <Plus className="w-[32px] h-[32px]" />
            </div>
            <div>Create New Collection</div>
          </div>
        </div>

        {bookmarksCollection?.collection.docs.map(collection => (
          <div
            key={collection.id}
            className="flex flex-col gap-2 cursor-pointer"
            role="presentation"
            onClick={() =>
              addBookmark({
                userId: user?.user?.id || '',
                bookmarkcollectionId: collection.id,
                productId: productId,
              })
            }>
            <div className="flex gap-6 items-center">
              <div className=" flex items-center justify-center w-[64px] h-[64px] rounded-lg border-slate-300 border-solid border p-2">
                <Image
                  src={collection.image || ''}
                  width={64}
                  height={64}
                  alt="Placeholder"
                />
              </div>
              <div>{collection.title}</div>
            </div>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkDialog;
