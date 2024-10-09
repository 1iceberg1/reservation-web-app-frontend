const ROOTS = {
  ADMIN: '/admin',
  GUEST: '/guest',
};

// ----------------------------------------------------------------------

export const paths = {
  login: '/',
  register: '/register',
  admin: {
    root: ROOTS.ADMIN,
    profile: `${ROOTS.ADMIN}/profile`,
    setting: `${ROOTS.ADMIN}/setting`,
    reservation: {
      new: `${ROOTS.ADMIN}/reservation/new`,
      details: (id: string) => `${ROOTS.ADMIN}/reservation/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/reservation/${id}/edit`,
    },
    user: {
      root: `${ROOTS.ADMIN}/user`,
      new: `${ROOTS.ADMIN}/user/new`,
      edit: (id: string) => `${ROOTS.ADMIN}/user/${id}/edit`,
    },
    consumption: {
      root: `${ROOTS.ADMIN}/consumption`,
      new: `${ROOTS.ADMIN}/consumption/new`,
      details: (id: string) => `${ROOTS.ADMIN}/consumption/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/consumption/${id}/edit`,
    },
  },
  guest: {
    root: ROOTS.GUEST,
    profile: `${ROOTS.GUEST}/profile`,
    setting: `${ROOTS.GUEST}/setting`,
    checkout: `${ROOTS.GUEST}/checkout`,
    reservation: {
      root: `${ROOTS.GUEST}/reservation`,
      details: (id: string) => `${ROOTS.GUEST}/reservation/${id}`,
    },
    payment: {
      root: `${ROOTS.GUEST}/payment`,
      complete: `${ROOTS.GUEST}/payment/complete`,
    },
  },
  comingSoon: '/coming-soon',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
};
