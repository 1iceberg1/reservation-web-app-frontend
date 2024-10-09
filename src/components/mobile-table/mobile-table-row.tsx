import React from 'react';
import { Box } from '@mui/system';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Card,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';

import { IReservationItem } from 'src/types/reservation';

type Props = {
  columns: GridColDef[];
  rowData: IReservationItem;
};

export function MobileTableRow({ columns, rowData }: Props) {
  const params = {
    row: rowData,
  } as GridRenderCellParams;

  const isAvailable = (value: any): boolean => {
    if (value === undefined) return false;
    return true;
  };

  return (
    <Card>
      <Table>
        <TableBody>
          {columns.map((column, index) => (
            <TableRow key={index}>
              {isAvailable(rowData[column.field]) && (
                <>
                  <TableCell>
                    <Typography>{column.headerName}</Typography>
                  </TableCell>
                  <TableCell>
                    {column.renderCell ?
                      <>{column.renderCell(params)}</>
                      : <Typography variant="subtitle1">
                        {rowData[column.field] ?? ''}
                      </Typography>
                    }
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box width="100%" px={3} my={2}>
        <Button
          variant="outlined"
          fullWidth
          href={`${paths.guest.reservation.root}/${rowData.id}`}
        >
          <Iconify icon="solar:eye-bold" mr={2} />
          <Typography>Visualizar</Typography>
        </Button>
      </Box>
    </Card>
  );
}
