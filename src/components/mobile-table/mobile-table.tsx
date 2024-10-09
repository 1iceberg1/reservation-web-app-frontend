import { Stack } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';

import { MobileTableRow } from 'src/components/mobile-table/mobile-table-row';

import { IReservationItem } from 'src/types/reservation';

type Props = {
  rows: IReservationItem[];
  columns: GridColDef[];
};

export function MobileTable({ rows, columns }: Props) {
  return (
    <Stack rowGap={2}>
      {rows.map(row => (
        <MobileTableRow rowData={row} columns={columns} key={row.id} />
      ))}
    </Stack>
  );
}
