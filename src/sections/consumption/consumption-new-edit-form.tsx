import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFTextField,
} from 'src/components/hook-form';

import { IConsumptionItem } from 'src/types/consumption';

// ----------------------------------------------------------------------

type Props = {
  currentConsumption?: IConsumptionItem;
};

export default function ConsumptionNewEditForm({ currentConsumption }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewConsumptionSchema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    description: Yup.string().required(''),
    price: Yup.number().moreThan(0, ''),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentConsumption?.name || '',
      description: currentConsumption?.description || '',
      price: currentConsumption?.price || 0,
    }),
    [currentConsumption]
  );

  const methods = useForm({
    resolver: yupResolver(NewConsumptionSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentConsumption) {
      reset(defaultValues);
    }
  }, [currentConsumption, defaultValues, reset]);

  const onSubmit = handleSubmit(async data => {
    try {
      if (currentConsumption) {
        await axios.put(
          `${endpoints.consumption}/${currentConsumption.id}`,
          data
        );
      } else {
        await axios.post(endpoints.consumption, data);
      }
      reset();
      enqueueSnackbar(
        currentConsumption ? 'Atualizar sucesso!' : 'Criar sucesso!'
      );
      router.push(paths.admin.consumption.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card>
            <Stack spacing={3} sx={{ p: 3 }}>
              <RHFTextField name="name" label="Nome" />

              <Stack spacing={1}>
                <Typography variant="subtitle2">Consumption</Typography>
                <RHFEditor simple name="description" />
              </Stack>

              <RHFTextField name="price" label="Price" />

              <Stack alignItems="flex-end">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  {!currentConsumption ?
                    'Criar Consumption'
                    : 'Salvar alterações'}
                </LoadingButton>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
