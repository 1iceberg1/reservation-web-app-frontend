import { useState, useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { statuses } from 'src/assets/data';

import {
  IReservationTableFilters,
  IReservationTableFilterValue,
} from 'src/types/reservation';

// ----------------------------------------------------------------------

type Props = {
  filters: IReservationTableFilters;
  onFilters: (name: string, value: IReservationTableFilterValue) => void;
};

export default function ReservationTableToolbar({ filters, onFilters }: Props) {
  const [status, setStatus] = useState<string[]>(filters.status);

  const handleChangeStatus = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;
      setStatus(typeof value === 'string' ? value.split(',') : value);
    },
    []
  );

  const handleCloseStatus = useCallback(() => {
    onFilters('status', status);
  }, [onFilters, status]);

  return (
    <FormControl
      sx={{
        flexShrink: 0,
        width: { xs: 1, md: 200 },
      }}
    >
      <InputLabel>Status</InputLabel>

      <Select
        multiple
        value={status}
        onChange={handleChangeStatus}
        input={<OutlinedInput label="Status" />}
        renderValue={selected => selected.map(value => value).join(', ')}
        onClose={handleCloseStatus}
        sx={{ textTransform: 'capitalize' }}
      >
        {statuses.map(option => (
          <MenuItem key={option} value={option}>
            <Checkbox
              disableRipple
              size="small"
              checked={status.includes(option)}
            />
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
