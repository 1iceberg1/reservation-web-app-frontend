import { useMemo } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import SvgColor from 'src/components/svg-color';
import Iconify from 'src/components/iconify/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const ICONS = {
  user: icon('ic_user'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { isAdmin } = useAuthContext();

  const data = useMemo(
    () =>
      isAdmin ?
        [
          // ACCOUNT
          // ----------------------------------------------------------------------
          {
            subheader: 'Conta',
            items: [
              {
                title: 'Perfil',
                path: paths.admin.profile,
                icon: <AccountCircleIcon />,
              },
              {
                title: 'Configurações',
                path: paths.admin.setting,
                icon: <SettingsIcon />,
              },
            ],
          },

          // MANAGEMENT
          // ----------------------------------------------------------------------
          {
            subheader: 'Gerenciamento',
            items: [
              // RESERVATION
              {
                title: 'Reserva',
                path: paths.admin.root,
                icon: <Iconify icon="zondicons:location-hotel" />,
              },

              // USER
              {
                title: 'usuário',
                path: paths.admin.user.root,
                icon: ICONS.user,
              },

              // CONSUMPTION
              {
                title: 'Consumo',
                path: paths.admin.consumption.root,
                icon: (
                  <Iconify icon="iconoir:web-window-energy-consumption-solid" />
                ),
              },
            ],
          },
        ]
      : [
          // ACCOUNT
          // ----------------------------------------------------------------------
          {
            subheader: 'Conta',
            items: [
              {
                title: 'Perfil',
                path: paths.guest.profile,
                icon: <AccountCircleIcon />,
              },
              {
                title: 'Configurações',
                path: paths.guest.setting,
                icon: <SettingsIcon />,
              },
            ],
          },

          // MANAGEMENT
          // ----------------------------------------------------------------------
          {
            subheader: 'Reserva',
            items: [
              // CHECKIN
              {
                title: 'Checkin',
                path: paths.guest.root,
                icon: <Iconify icon="line-md:log-in" />,
              },
              // CHECKOUT
              {
                title: 'Checkout',
                path: paths.guest.checkout,
                icon: <Iconify icon="line-md:log-out" />,
              },
              // RESERVATION
              {
                title: 'Reserva',
                path: paths.guest.reservation.root,
                icon: <Iconify icon="zondicons:location-hotel" />,
              },
            ],
          },
        ],
    [isAdmin]
  );

  return data;
}
