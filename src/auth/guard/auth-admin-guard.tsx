import React, { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

type Props = {
  children: React.ReactNode;
};

export default function AuthAdminGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return (
    <React.Fragment>
      {loading ?
        <SplashScreen />
        : <Container>{children}</Container>}
    </React.Fragment>
  );
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();

  const { authenticated, isGuest } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = paths.login;

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else if (isGuest) {
      router.replace(paths.guest.root);
    } else {
      setChecked(true);
    }
  }, [authenticated, router, isGuest]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
