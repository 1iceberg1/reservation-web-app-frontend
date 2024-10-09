import MaskedInput from 'react-input-mask';
import { Controller, useFormContext } from 'react-hook-form';

import TextField, { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  mask?: string;
};

export default function RHFTextField({
  name,
  helperText,
  type,
  mask,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          if (type === 'number') {
            field.onChange(Number(event.target.value));
          } else {
            field.onChange(event.target.value);
          }
        };

        // Handle masking
        const maskedInput = (
          <MaskedInput
            mask={mask || ''}
            value={field.value || ''}
            onChange={handleChange}
            maskChar=""
            onBlur={field.onBlur} // Pass onBlur directly
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                {...other}
                fullWidth
                error={!!error}
                helperText={error ? error?.message : helperText}
              />
            )}
          </MaskedInput>
        );

        // Regular input
        const regularInput = (
          <TextField
            {...field}
            fullWidth
            type={type}
            value={type === 'number' && field.value === 0 ? '' : field.value}
            onChange={handleChange}
            error={!!error}
            helperText={error ? error?.message : helperText}
            {...other}
          />
        );

        // Return masked input if mask is provided
        return mask ? maskedInput : regularInput;
      }}
    />
  );
}
