'use client';

import React, { useMemo } from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Separator } from './ui/separator';
import { Button, buttonVariants } from './ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const ACCOUNT_NAV = [
  {
    name: 'My Collections',
    href: '/account/collections',
  },
  {
    name: 'My Reviews',
    href: '/account/reviews',
  },
  {
    name: 'My Settings',
    href: '/account/settings',
  },
];

interface AccountLayoutProps {
  children: React.ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
  const path = usePathname();

  return (
    <MaxWidthWrapper className="bg-white">
      <section className="py-12">
        <div className="py-6">
          <h1 className="text-2xl font-bold">Account</h1>
          <p className=" text-muted-foreground">
            Check your collections and manage your settings
          </p>
        </div>
        <Separator />
        <div className="grid grid-cols-4 auto-cols-fr gap-4 py-6">
          <div className=" flex flex-col col-span-1 gap-2">
            {ACCOUNT_NAV.map(({ name, href }) => (
              <Button
                key={name}
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  }),
                  {
                    'bg-accent text-accent-foreground': href === path,
                  }
                )}>
                <Link
                  href={href}
                  className={cn('flex justify-start w-full h-full')}>
                  {name}
                </Link>
              </Button>
            ))}
          </div>
          <div className="col-span-3">{children}</div>
        </div>
      </section>
    </MaxWidthWrapper>
  );
};

export default AccountLayout;
