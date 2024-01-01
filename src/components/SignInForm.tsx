import useAuth from '@/hooks/use-auth';
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from '@/lib/validators/account-credentials-validator';
import { trpc } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Button, buttonVariants } from './ui/button';

const SignInForm = () => {
  const { setUser } = useAuth();
  const router = useRouter();

  const form = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: async data => {
      setUser(data.user);

      toast.success('Signed in successfully');

      router.refresh();

      if (origin) {
        router.push(`/${origin}`);
        return;
      }
    },
    onError: err => {
      if (err.data?.code === 'UNAUTHORIZED') {
        toast.error('Invalid email or password.');
      }
    },
  });

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    const res = signIn({ email, password });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Email"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}></FormField>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Password"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}></FormField>
        <Button
          type="submit"
          className={buttonVariants({
            variant: 'default',
            size: 'lg',
          })}
          disabled={isLoading}>
          Sign In
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
