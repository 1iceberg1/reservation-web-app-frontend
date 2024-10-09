'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ConsumptionNewEditForm from '../consumption-new-edit-form';

// ----------------------------------------------------------------------

export default function ConsumptionCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Criar um novo consumption"
        links={[
          {
            name: 'Painel',
            href: paths.admin.root,
          },
          {
            name: 'Consumption',
            href: paths.admin.consumption.root,
          },
          { name: 'Novo consumption' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ConsumptionNewEditForm />
    </Container>
  );
}
