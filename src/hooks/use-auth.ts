import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import { toast } from 'sonner';

const initialState = {
  user: {
    exp: 0,
    token: undefined,
    user: {
      createdAt: '',
      email: '',
      firstName: '',
      id: '',
      lastName: '',
      role: '',
      updatedAt: '',
      _verified: false,
    },
  },
};
const { useGlobalState, setGlobalState } = createGlobalState(initialState);

const setUser = (user: any) => {
  setGlobalState('user', user);
};

const getUser = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) throw new Error();

    const data = await res.json();

    if (!data) {
      setUser(initialState.user);
      return;
    }

    setUser(data);
  } catch (err) {
    console.log(err);
  }
};

export const useAuth = () => {
  const [user] = useGlobalState('user');
  const router = useRouter();

  useEffect(() => {
    if (!user.token) getUser();
  }, [user.token]);

  const signOut = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) throw new Error();

      toast.success('Signed out successfully');

      setUser(initialState.user);

      router.push('/sign-in');
      router.refresh();
    } catch (err) {
      toast.error("Couldn't sign out, please try again.");
    }
  };

  return { signOut, user, setUser };
};

export default useAuth;
