import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Switch, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';
import saveFileToServer from 'src/utils/save-file-to-server';

import { useAuthContext } from 'src/auth/hooks';
import { useGetReservations } from 'src/api/reservation';

import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content/empty-content';
import FormProvider, {
  RHFUpload,
  RHFTextField
} from 'src/components/hook-form';

import ReservationCheckoutForm from 'src/sections/reservation/reservation-checkout-form';

import { IReservationItem } from 'src/types/reservation';

// ----------------------------------------------------------------------

type Props = {
  currentReservation?: IReservationItem;
  fetchData?: () => Promise<void>;
};

export default function ReservationNewEditForm({
  currentReservation,
  fetchData
}: Props) {
  const router = useRouter();
  const { user, isAdmin } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const { reservationsEmpty } = useGetReservations({
    filter: { createdBy: user?.id, status: 'checkin' }
  });

  const [checkinStatus, setCheckinStatus] = useState(
    currentReservation?.status !== 'checkin'
  );

  useEffect(() => {
    if (isAdmin && currentReservation) {
      setCheckinStatus(currentReservation.status !== 'checkin');
    }
  }, [currentReservation, isAdmin]);

  const NewReservationSchema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().required(''),
    cpf: Yup.string().required(''),
    province: Yup.string().required(''),
    city: Yup.string().required(''),
    street: Yup.string().required(''),
    zipCode: Yup.string().required(''),
    documents: Yup.mixed<any[]>().nullable().required('Avatar é obrigatório')
  });

  const defaultValues = useMemo(
    () => ({
      name: currentReservation?.name || '',
      email: currentReservation?.email || '',
      cpf: currentReservation?.cpf || '',
      province: currentReservation?.province || '',
      city: currentReservation?.city || '',
      street: currentReservation?.street || '',
      zipCode: currentReservation?.zipCode || '',
      documents:
        currentReservation?.documents.map(document => ({
          ...document,
          preview: document.downloadUrl?.split('&')[0] || ''
        })) || []
    }),
    [currentReservation]
  );

  const methods = useForm({
    resolver: yupResolver(NewReservationSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (currentReservation) {
      reset(defaultValues);
    }
  }, [currentReservation, defaultValues, reset]);

  const onSubmit = handleSubmit(async data => {
    try {
      const fileIds: Array<string> = [];
      await Promise.all(
        data.documents.map(async item => {
          if (item && typeof item !== 'string' && item.path) {
            const file: File = item;
            const fileId = await saveFileToServer(file, 'reservationDocument');
            if (fileId) {
              fileIds.push(fileId);
            }
          }
        })
      );

      // eslint-disable-next-line
      const { documents, ...newData } = data;

      const params = {
        ...newData,
        ...(fileIds.length && { documents: fileIds }),
        ...(isAdmin && { status: checkinStatus ? 'checkout' : 'checkin' })
      };

      if (currentReservation) {
        await axios.put(
          `${endpoints.reservation}/${currentReservation.id}`,
          params
        );
      } else {
        await axios.post(endpoints.reservation, params);
      }
      reset();
      enqueueSnackbar(
        currentReservation ? 'Atualizar sucesso!' : 'Criar sucesso!'
      );
      setTimeout(() => router.push(paths.guest.checkout), 1000);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map(file =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      setValue('documents', newFiles, { shouldValidate: true });
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('documents', []);
  }, [setValue]);

  const reservationDetails = (
    <>
      {/* <CardHeader title="Detalhes" /> */}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card sx={{ backgroundColor: 'transparent' }}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Box
                  columnGap={2}
                  rowGap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(2, 1fr)'
                  }}
                >
                  <RHFTextField name="name" label="Nome" variant="standard" />
                  <RHFTextField name="email" label="Email" variant="standard" />
                  <RHFTextField
                    name="cpf"
                    label="CPF"
                    variant="standard"
                    mask="999.999.999-99"
                    helperText="Digite no formato 000.000.000-00"
                  />
                  <RHFTextField
                    name="province"
                    label="Province"
                    variant="standard"
                  />
                  <RHFTextField name="city" label="City" variant="standard" />
                  <RHFTextField
                    name="street"
                    label="Street"
                    variant="standard"
                  />
                  <RHFTextField
                    name="zipCode"
                    label="Zip Code"
                    variant="standard"
                  />
                </Box>
              </Grid>
              <Grid xs={12} md={6}>
                <Box>
                  <Typography variant="body2">Upload ID documents</Typography>
                  <RHFUpload
                    name="documents"
                    thumbnail
                    maxSize={10 * 1024 * 1024}
                    multiple
                    onDrop={handleDrop}
                    onDelete={handleRemoveFile}
                  />
                </Box>
              </Grid>
            </Grid>

            {isAdmin && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                {/* <FormControlLabel
                sx={{ mx: 0, flexDirection: 'row' }}
                control={}
                labelPlacement="start"
                label={checkinStatus ? "CheckOut" : "CheckIn"}
              /> */}
                <Switch
                  // value={checkinStatus}
                  checked={checkinStatus}
                  onChange={(e: any) => {
                    setCheckinStatus(e.target.checked);
                  }}
                />
                <Typography>
                  {checkinStatus ? 'CheckOut' : 'CheckIn'}
                </Typography>
              </Box>
            )}
            <Stack alignItems="flex-end" my={3} px={2}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {!currentReservation ? 'Criar lente' : 'Salvar alterações'}
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
      </FormProvider>
    </>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        {reservationsEmpty ?
          <>
            {reservationDetails}
            {fetchData && currentReservation && (
              <Card sx={{ backgroundColor: 'transparent' }}>
                <Stack p={2}>
                  <ReservationCheckoutForm
                    reservation={currentReservation}
                    fetchData={fetchData}
                  />
                </Stack>
              </Card>
            )}
          </>
        : <>
            <EmptyContent />
            <Typography textAlign="center">
              You&apos;ve already booked
            </Typography>
          </>
        }
      </Grid>
    </Grid>
  );
}
