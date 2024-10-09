'use client';

import React from 'react';
import { useMemo, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Button,
  TextField,
  Typography,
  IconButton,
  CardHeader
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';
import { fCurrency } from 'src/utils/format-number';

import { useAuthContext } from 'src/auth/hooks';
// import { useGetReservations } from 'src/api/reservation';
import { useGetConsumptions } from 'src/api/consumption';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content/empty-content';
import { ConfirmDialog, ConsumptionDialog } from 'src/components/custom-dialog';

import { IReservationItem } from 'src/types/reservation';

// ----------------------------------------------------------------------

type Props = {
  reservation: IReservationItem;
  fetchData: () => Promise<void>;
};

export default function ReservationCheckoutForm({
  reservation,
  fetchData
}: Props) {
  const { isAdmin } = useAuthContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const { consumptions } = useGetConsumptions();
  const [deleteIndex, setDeleteIndex] = useState(-1);

  const disableCheckout = useMemo(() => {
    if (reservation.consumptions.length) return false;
    return true;
  }, [reservation]);

  const totalPrice = useMemo(() => {
    let total = 0;
    reservation.consumptions?.forEach(consumption => {
      total +=
        (consumption.consumption?.price ?? 0) * (consumption.quantity ?? 0);
    });
    return total;
  }, [reservation]);

  const consumptionDialog = useBoolean();
  const confirmDialog = useBoolean();

  const handleAddConsumption = async (
    consumptionId: string,
    quantity: number
  ) => {
    const consumptionData = reservation.consumptions.map(consumption => ({
      consumption: consumption.consumption?.id || '',
      quantity: consumption.quantity
    }));
    consumptionData.push({ consumption: consumptionId, quantity });

    const params = {
      consumptions: consumptionData
    };

    try {
      await axios.put(`${endpoints.reservation}/${reservation.id}`, params);
      consumptionDialog.onFalse();
      enqueueSnackbar('Update Success!');
      await fetchData();
    } catch (error) {
      enqueueSnackbar('Unable to Update Consumption!', { variant: 'error' });
    }
  };

  const handleDeleteConsumption = async (index: number) => {
    const consumptionData = reservation.consumptions
      .filter((_, i) => i !== index)
      .map(consumption => ({
        consumption: consumption.consumption?.id || '',
        quantity: consumption.quantity
      }));

    const params = {
      consumptions: consumptionData
    };

    try {
      await axios.put(`${endpoints.reservation}/${reservation.id}`, params);
      confirmDialog.onFalse();
      enqueueSnackbar('Delete Success!');
      await fetchData();
      setDeleteIndex(-1);
    } catch (error) {
      enqueueSnackbar('Unable to Delete Consumption!', { variant: 'error' });
    }
  };

  const handlePayment = () => {
    if (disableCheckout) return;
    router.push(paths.guest.payment.root);
  };

  // const reservationDetails = (
  //   <Card sx={{ backgroundColor: 'transparent' }}>
  //     <CardHeader title="Reservation Details" />

  //     <Stack spacing={3} sx={{ p: 3 }}>
  //       <Box
  //         columnGap={2}
  //         rowGap={3}
  //         display="grid"
  //         gridTemplateColumns={{
  //           xs: 'repeat(1, 1fr)',
  //           sm: 'repeat(2, 1fr)',
  //           md: 'repeat(3, 1fr)'
  //         }}
  //       >
  //         <TextField
  //           value={reservation.name || ''}
  //           label="Nome"
  //           variant="standard"
  //           InputProps={{ readOnly: true }}
  //         />
  //         <TextField
  //           value={reservation.email || ''}
  //           label="Email"
  //           variant="standard"
  //           InputProps={{ readOnly: true }}
  //         />
  //         <TextField
  //           value={reservation.cpf || ''}
  //           label="CPF"
  //           variant="standard"
  //           InputProps={{ readOnly: true }}
  //         />
  //         <TextField
  //           value={reservation.province || ''}
  //           label="Province"
  //           variant="standard"
  //           InputProps={{ readOnly: true }}
  //         />
  //         <TextField
  //           value={reservation.city || ''}
  //           label="City"
  //           variant="standard"
  //           InputProps={{ readOnly: true }}
  //         />
  //         <TextField
  //           value={reservation.street || ''}
  //           label="Street"
  //           variant="standard"
  //           InputProps={{ readOnly: true }}
  //         />
  //         <TextField
  //           value={reservation.zipCode || ''}
  //           label="Zip Code"
  //           variant="standard"
  //           InputProps={{ readOnly: true }}
  //         />
  //       </Box>
  //     </Stack>
  //   </Card>
  // );

  const consumptionDetails = (
    <Card sx={{ backgroundColor: 'transparent' }}>
      <CardHeader title="Consumption Details" />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box>
          {reservation.consumptions.map((consumption, index) => (
            <Box
              key={index}
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)'
              }}
              mb={4}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-end'
                }}
              >
                <TextField
                  value={consumption?.consumption?.name || ''}
                  label="Consumption"
                  variant="standard"
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <IconButton
                  onClick={() => {
                    setDeleteIndex(index);
                    confirmDialog.onTrue();
                  }}
                  sx={{ width: 40, height: 40 }}
                >
                  <Iconify
                    icon="ph:trash"
                    width={24}
                    height={24}
                    color={theme.palette.error.main}
                  />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <TextField
                  value={consumption?.consumption?.price || ''}
                  label="Price"
                  variant="standard"
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  value={consumption?.quantity || ''}
                  label="Quantity"
                  variant="standard"
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  value={
                    (consumption?.consumption?.price ?? 0) *
                    (consumption?.quantity ?? 0) || ''
                  }
                  label="Sub Total"
                  variant="standard"
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Stack>
    </Card>
  );

  return (
    <>
      {!reservation ?
        <EmptyContent />
        : <Stack rowGap={2}>
          {/* {reservationDetails} */}
          {consumptionDetails}
          <Typography variant="h4">
            Total Price: {fCurrency(totalPrice)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => consumptionDialog.onTrue()}
          >
            Add Consumption
          </Button>
          {!isAdmin && (
            <Button
              variant="contained"
              onClick={() => handlePayment()}
              disabled={disableCheckout}
            >
              Checkout
            </Button>
          )}
        </Stack>
      }
      <ConsumptionDialog
        open={consumptionDialog.value}
        onClose={consumptionDialog.onFalse}
        handleClick={handleAddConsumption}
        consumptions={consumptions}
      />
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={() => {
          confirmDialog.onFalse();
          setDeleteIndex(-1);
        }}
        title={<Typography>Do you want to delete?</Typography>}
        content=""
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteConsumption(deleteIndex)}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
