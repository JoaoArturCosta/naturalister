import { z } from 'zod';

export const AuthCredentialsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
});

export const AuthCredentialsValidatorWithName = AuthCredentialsValidator.extend(
  {
    firstName: z.string().min(2, {
      message: 'First name must be at least 2 characters long.',
    }),
    lastName: z.string().min(2, {
      message: 'Last name must be at least 2 characters long.',
    }),
  }
);

export type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>;

export type TAuthCredentialsValidatorWithName = z.infer<
  typeof AuthCredentialsValidatorWithName
>;
