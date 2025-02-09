import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Iconify from 'src/components/iconify';
// import { usePopover } from 'src/components/custom-popover';

import { IUserTableFilters, IUserTableFilterValue } from 'src/types/user';

// ----------------------------------------------------------------------

type Props = {
  filters: IUserTableFilters;
  onFilters: (name: string, value: IUserTableFilterValue) => void;
  //
  roleOptions: string[];
};

export default function UserTableToolbar({
  filters,
  onFilters,
  //
  roleOptions,
}: Props) {
  // const popover = usePopover();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterRole = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'role',
        typeof event.target.value === 'string' ?
          event.target.value.split(',')
        : event.target.value
      );
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Papel</InputLabel>

        <Select
          multiple
          value={filters.role}
          onChange={handleFilterRole}
          input={<OutlinedInput label="Papel" />}
          renderValue={selected => selected.map(value => value).join(', ')}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          {roleOptions.map(option => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                size="small"
                checked={filters.role.includes(option)}
              />
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        flexGrow={1}
        sx={{ width: 1 }}
      >
        <TextField
          fullWidth
          value={filters.name}
          onChange={handleFilterName}
          placeholder="Procurar..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled' }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Stack>
  );
}
