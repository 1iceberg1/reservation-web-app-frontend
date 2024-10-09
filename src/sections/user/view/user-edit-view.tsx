'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetUser } from 'src/api/user';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { user, userLoading } = useGetUser(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Editar"
        links={[
          {
            name: 'Painel',
            href: paths.admin.root,
          },
          {
            name: 'Usuário',
            href: paths.admin.user.root,
          },
          { name: user?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {!userLoading && <UserNewEditForm currentUser={user} />}
    </Container>
  );
}
