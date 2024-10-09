import React, { useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return (
    <>
      {loading ?
        <SplashScreen />
        : <Container>{children}</Container>}
    </>
  );
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const { authenticated, isAdmin } = useAuthContext();

  const check = useCallback(() => {
    if (authenticated) {
      if (isAdmin) {
        router.replace(returnTo || paths.admin.root);
      } else {
        router.replace(returnTo || paths.guest.root);
      }
    }
  }, [authenticated, returnTo, router, isAdmin]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
