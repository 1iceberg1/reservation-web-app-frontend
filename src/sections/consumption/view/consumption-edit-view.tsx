'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetConsumption } from 'src/api/consumption';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ConsumptionNewEditForm from '../consumption-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ConsumptionEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { consumption: currentConsumption } = useGetConsumption(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Editar"
        links={[
          { name: 'Painel', href: paths.admin.root },
          {
            name: 'Consumption',
            href: paths.admin.consumption.root,
          },
          { name: currentConsumption?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ConsumptionNewEditForm currentConsumption={currentConsumption} />
    </Container>
  );
}
