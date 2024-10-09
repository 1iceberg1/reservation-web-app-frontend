'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import { Avatar, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { IReservationItem } from 'src/types/reservation';

type Props = {
  reservation: IReservationItem;
};

export default function ReservationDetailsContent({ reservation }: Props) {
  const {
    name,
    email,
    cpf,
    province,
    city,
    street,
    zipCode,
    // consumptions,
    // documents,
    status,
    // createdBy,
    cost
  } = reservation;

  const reservationDetails = (
    <Card>
      <CardHeader title="Detalhes" />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          }}
        >
          <TextField
            variant="standard"
            value={name}
            label="Name"
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            variant="standard"
            value={email}
            label="Email"
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            variant="standard"
            value={cpf}
            label="CPF"
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            variant="standard"
            value={province}
            label="Province"
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            variant="standard"
            value={city}
            label="City"
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            variant="standard"
            value={street}
            label="Street"
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            variant="standard"
            value={zipCode}
            label="Zip Code"
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            variant="standard"
            value={status}
            label="Status"
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            variant="standard"
            value={cost}
            label="Cost"
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                    R$
                  </Box>
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Stack rowGap={2} mt={2}>
          <Typography variant="body2">Documents</Typography>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            }}
          >
            {reservation.documents.map(document => (
              <Avatar
                key={document.id}
                src={document.downloadUrl || ''}
                variant="square"
                alt="document"
                sx={{ width: '100%', height: '100%', borderRadius: 1 }}
              />
            ))}
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} item>
        {reservationDetails}
      </Grid>
    </Grid>
  );
}
