'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Rating } from '@smastrom/react-rating';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';
import {
  ReviewValidator,
  TReviewValidator,
} from '@/lib/validators/review-validator';
import useAuth from '@/hooks/use-auth';
import { Separator } from '@/components/ui/separator';

const ReviewsForm = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const form = useForm<TReviewValidator>({
    resolver: zodResolver(ReviewValidator),
    defaultValues: {
      id: productId,
      author: `${user?.user.firstName} ${user?.user.lastName}` || '',
      review: '',
      rating: 0,
    },
  });

  const { mutate: processComment, isLoading } = trpc.postReview.useMutation({
    onSuccess: async () => {
      toast.success('Your Review was submitted successfully');

      form.reset();
    },
    onError: error => {
      toast.error(
        'An error occurred while submitting your review. Please try again.'
      );
    },
  });

  const onSubmit = (values: TReviewValidator) => {
    console.log('values', values);
    processComment(values);
  };

  if (!user?.token) return null;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8">
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={!user?.token}
                    placeholder="Tell us your thoughts..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <Rating
                  style={{ maxWidth: 100 }}
                  isRequired
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
                <FormLabel> {field.value} / 5 </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading || !user?.token}
            type="submit">
            Submit
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default ReviewsForm;
