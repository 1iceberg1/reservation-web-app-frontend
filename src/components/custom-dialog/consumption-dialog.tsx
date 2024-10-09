import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { isOptionEqualToValue } from 'src/utils';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import type { ConsumptionDialogProps } from './types';

// ----------------------------------------------------------------------

const ConsumptionSchema = Yup.object().shape({
  consumption: Yup.object()
    .shape({ value: Yup.string().required('Consumption Value is required!') })
    .required('Consumption is required!'),
  quantity: Yup.number()
    .typeError('Quantity must be a number') // Custom error message for invalid types
    .required('Quantity is required!')
    .positive('Quantity must be a positive number') // Optional: to ensure the number is positive
    .integer('Quantity must be an integer'),
});

export function ConsumptionDialog({
  consumptions,
  handleClick,
  open,
  onClose,
  ...other
}: ConsumptionDialogProps) {
  const defaultValues = {
    quantity: 0,
    consumption: { value: '', label: '' },
  };

  const methods = useForm({
    resolver: yupResolver(ConsumptionSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async data => {
    if (data.consumption.value && data.quantity)
      handleClick(data.consumption.value, data.quantity);
  });

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle sx={{ pb: 2 }}>Add Consumption</DialogTitle>

        <DialogContent sx={{ typography: 'body2' }}>
          <Stack rowGap={2}>
            <RHFAutocomplete
              name="consumption"
              disableClearable
              options={consumptions.map(consumption => ({
                value: consumption.id || '',
                label: consumption.name || '',
              }))}
              isOptionEqualToValue={isOptionEqualToValue}
            />
            <RHFTextField type="number" name="quantity" label="Quantity" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            loading={isSubmitting}
            color="primary"
            variant="contained"
            type="submit"
          >
            Add
          </LoadingButton>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};
