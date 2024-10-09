'use client';

import { parseISO } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProfileCover from '../profile-cover';

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();

  const { user, isAdmin } = useAuthContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Perfil"
        links={[
          {
            name: 'Painel',
            href: isAdmin ? paths.admin.root : paths.guest.root,
          },
          { name: user?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={user?.role}
          name={user?.name}
          avatarUrl={user?.avatar?.downloadUrl}
          coverUrl="/assets/account/cover.jpg"
        />

        <Tabs
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 2,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        />
      </Card>

      <Card sx={{ p: 4 }}>
        <Box
          rowGap={5}
          columnGap={4}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          <TextField fullWidth value={user?.name} label="Nome" />
          <TextField fullWidth value={user?.email} label="E-mail" />
          <TextField fullWidth value={user?.phoneNumber} label="Telefone" />
          <TextField fullWidth value={user?.cpf} label="Número do CPF" />
          <TextField fullWidth value={user?.province} label="Province" />
          <TextField fullWidth value={user?.city} label="City" />
          <TextField fullWidth value={user?.street} label="Street" />
          <TextField fullWidth value={user?.zipCode} label="Zip Code" />
          <DatePicker
            label="Aniversário"
            readOnly
            value={user?.birthday ? parseISO(user.birthday) : null}
            format="MM/dd/yyyy"
          />
        </Box>
      </Card>
    </Container>
  );
}
