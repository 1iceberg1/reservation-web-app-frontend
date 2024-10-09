'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetReservation } from 'src/api/reservation';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ReservationNewEditForm from '../reservation-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ReservationEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { reservation: currentReservation, fetchReservationManually } =
    useGetReservation(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Editar"
        links={[
          { name: 'Painel', href: paths.admin.root },
          {
            name: 'Reserva',
            href: paths.admin.root,
          },
          { name: currentReservation?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ReservationNewEditForm
        currentReservation={currentReservation}
        fetchData={fetchReservationManually}
      />
    </Container>
  );
}
