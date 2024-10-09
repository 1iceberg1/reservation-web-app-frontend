'use client';

import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useAuthContext } from 'src/auth/hooks';
import { useGetReservation } from 'src/api/reservation';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import ReservationDetailsContent from 'src/sections/reservation/reservation-details-content';

import { ReservationDetailsSkeleton } from '../reservation-skeleton';
import ReservationDetailsToolbar from '../reservation-details-toolbar';

type Props = {
  id: string;
};

export default function ReservationDetailsView({ id }: Props) {
  const { reservation, reservationLoading, reservationError } =
    useGetReservation(id);

  const { isAdmin } = useAuthContext();

  const settings = useSettingsContext();

  const renderSkeleton = <ReservationDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${reservationError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.admin.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          De volta à lista
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderReservation = reservation && (
    <>
      <ReservationDetailsToolbar
        backLink={paths[isAdmin ? 'admin' : 'guest']?.root}
        editLink={
          isAdmin ? paths.admin.reservation.edit(`${reservation?.id}`) : null
        }
      />
      <ReservationDetailsContent reservation={reservation} />
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {reservationLoading && renderSkeleton}

      {reservationError && renderError}

      {reservation && renderReservation}
    </Container>
  );
}
