import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';
import { Stack, IconButton, Typography } from '@mui/material';

import Iconify from 'src/components/iconify/iconify';

type Props = {
  name: string;
  step: number;
  limit: {
    start: number;
    end: number;
  };
};

export default function NumberPickerFormItem({ name, step, limit }: Props) {
  const { control } = useFormContext();

  const handleIncrease = currentValue => currentValue + step;

  const handleDecrease = currentValue => currentValue - step;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <Stack spacing={1}>
            <IconButton
              onClick={() => onChange(handleIncrease(value))}
              disabled={value >= limit.end}
              aria-label="increase"
            >
              <Iconify icon="ep:arrow-up" />
            </IconButton>
            <Typography variant="h2">{value.toFixed(2)}</Typography>
            <IconButton
              onClick={() => onChange(handleDecrease(value))}
              disabled={value <= limit.start}
              aria-label="decrease"
            >
              <Iconify icon="ep:arrow-down" />
            </IconButton>
          </Stack>
          {!!error && (
            <FormHelperText error={!!error}>
              {error ? error?.message : ''}
            </FormHelperText>
          )}
        </>
      )}
    />
  );
}
