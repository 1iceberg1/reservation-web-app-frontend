import React, { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

type Props = {
  children: React.ReactNode;
};

export default function AuthGuestGuard({ children }: Props) {
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

  const { authenticated, isAdmin, user, logout } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = paths.login;

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else if (isAdmin) {
      router.replace(paths.admin.root);
    } else {
      if (user?.status === 'deactive') {
        logout().then();

        router.push(paths.login);

        return;
      }

      setChecked(true);
    }
  }, [authenticated, router, isAdmin, logout, user?.status]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
