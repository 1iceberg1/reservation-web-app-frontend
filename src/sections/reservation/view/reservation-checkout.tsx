'use client';

import React from 'react';
import { Stack } from '@mui/system';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';
import { useGetReservations } from 'src/api/reservation';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import EmptyContent from 'src/components/empty-content/empty-content';

import ReservationCheckoutForm from 'src/sections/reservation/reservation-checkout-form';
import ReservationDetailsContent from 'src/sections/reservation/reservation-details-content';

// ----------------------------------------------------------------------

export default function ReservationCheckout() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const { reservations, fetchReservationsManually } = useGetReservations({
    filter: { createdBy: user?.id, status: 'checkin' },
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Checkout"
        links={[
          { name: 'Painel', href: paths.admin.root },
          { name: 'Checkout' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {reservations[0] ?
        <>
          <ReservationDetailsContent reservation={reservations[0]} />
          <ReservationCheckoutForm
            reservation={reservations[0]}
            fetchData={fetchReservationsManually}
          />
        </>
        : <Stack>
          <EmptyContent />
          <Typography textAlign="center">
            No reservation is available
          </Typography>
        </Stack>
      }
    </Container>
  );
}
