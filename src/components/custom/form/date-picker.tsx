import { parseISO } from 'date-fns';
import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// ----------------------------------------------------------------------

type Props = {
  name: string;
  label: string;
};

export default function DatePickerFormItem({ name, label }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={new Date()}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <DatePicker
          label={label}
          value={value ? parseISO(value) : null}
          inputRef={ref}
          onChange={onChange}
          format="MM/dd/yyyy"
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error ? error.message : '',
              InputLabelProps: { shrink: true },
            },
          }}
        />
      )}
    />
  );
}
