'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ReservationNewEditForm from '../reservation-new-edit-form';

// ----------------------------------------------------------------------

export default function ReservationCheckin() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Checkin"
        links={[
          {
            name: 'Painel',
            href: paths.admin.root,
          },
          { name: 'Checkin' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <ReservationNewEditForm />
    </Container>
  );
}
