'use client';

import isEqual from 'lodash/isEqual';
import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useMediaQuery } from '@mui/material';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowSelectionModel,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import axios, { endpoints } from 'src/utils/axios';
import { fCurrency } from 'src/utils/format-number';

import { useAuthContext } from 'src/auth/hooks';
import { useGetReservations } from 'src/api/reservation';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { MobileTable } from 'src/components/mobile-table/mobile-table';

import {
  IReservationItem,
  IReservationTableFilters,
  IReservationTableFilterValue
} from 'src/types/reservation';

import ReservationTableToolbar from '../reservation-table-toolbar';
import ReservationTableFiltersResult from '../reservation-table-filters-result';

const defaultFilters: IReservationTableFilters = {
  status: []
};

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

// ----------------------------------------------------------------------

export default function ReservationListView() {
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();

  const router = useRouter();

  const { isAdmin, user } = useAuthContext();
  const isSmallScreen = useMediaQuery('(max-width:640px)');

  const settings = useSettingsContext();

  const { reservations, reservationsLoading } = useGetReservations(
    isAdmin ?
      {}
    : {
        filter: { createdBy: user?.id || '' }
      }
  );

  const [tableData, setTableData] = useState<IReservationItem[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>(
    []
  );

  useEffect(() => {
    if (reservations.length) {
      setTableData(reservations);
    }
  }, [reservations]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters
  });

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback(
    (name: string, value: IReservationTableFilterValue) => {
      setFilters(prevState => ({
        ...prevState,
        [name]: value
      }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios.delete(endpoints.reservation, { data: { ids: [id] } });
      const deleteRow = tableData.filter(row => row.id !== id);

      enqueueSnackbar('Excluir sucesso!');

      setTableData(deleteRow);
    },
    [enqueueSnackbar, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    await axios.delete(endpoints.reservation, {
      data: { ids: selectedRowIds }
    });
    const deleteRows = tableData.filter(
      row => !selectedRowIds.includes(row.id)
    );

    enqueueSnackbar('Excluir sucesso!');

    setTableData(deleteRows);
  }, [enqueueSnackbar, selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.admin.reservation.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths[isAdmin ? 'admin' : 'guest']?.reservation.details(id));
    },
    [router, isAdmin]
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nome',
      width: 160,
      hideable: false,
      renderCell: params => (
        <Tooltip title={params.row?.name}>
          <Box
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {params.row?.name}
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'email',
      headerName: 'Email',
      maxWidth: 160,
      flex: 1
    },
    {
      field: 'cpf',
      headerName: 'CPF',
      maxWidth: 160,
      flex: 1
    },
    {
      field: 'province',
      headerName: 'Province',
      maxWidth: 160,
      flex: 1
    },
    {
      field: 'city',
      headerName: 'City',
      maxWidth: 160,
      flex: 1
    },
    {
      field: 'street',
      headerName: 'Street',
      maxWidth: 160,
      flex: 1
    },
    {
      field: 'zipCode',
      headerName: 'Zip Code',
      maxWidth: 160,
      flex: 1
    },
    {
      field: 'status',
      headerName: 'Status',
      maxWidth: 160,
      flex: 1,
      renderCell: params => (
        <Label
          variant="soft"
          color={
            (params.row.status === 'checkout' && 'success') ||
            (params.row.status === 'checkin' && 'warning') ||
            'default'
          }
        >
          {params.row.status}
        </Label>
      )
    },
    {
      field: 'cost',
      headerName: 'Cost',
      maxWidth: 120,
      renderCell: params => <>{fCurrency(params.row?.cost)}</>
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      maxWidth: 120,
      renderCell: params => <>{fDate(params.row?.createdAt || '')}</>
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      maxWidth: 120,
      renderCell: params => <>{fDate(params.row?.updatedAt || '')}</>
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: 'Ações',
      align: 'right',
      headerAlign: 'right',
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: params =>
        isAdmin ?
          [
            <GridActionsCellItem
              key={`${params.row?.id || ''}-view`}
              showInMenu
              icon={<Iconify icon="solar:eye-bold" />}
              label="Visualizar"
              onClick={() => handleViewRow(params.row?.id)}
            />,
            <GridActionsCellItem
              key={`${params.row?.id || ''}-edit`}
              showInMenu
              icon={<Iconify icon="solar:pen-bold" />}
              label="Editar"
              onClick={() => handleEditRow(params.row?.id)}
            />,
            <GridActionsCellItem
              key={`${params.row?.id || ''}-delete`}
              showInMenu
              icon={<Iconify icon="solar:trash-bin-trash-bold" />}
              label="Excluir"
              onClick={() => {
                handleDeleteRow(params.row?.id);
              }}
              sx={{ color: 'error.main' }}
            />
          ]
        : [
            <GridActionsCellItem
              key={`${params.row?.id || ''}-view`}
              showInMenu
              icon={<Iconify icon="solar:eye-bold" />}
              label="Visualizar"
              onClick={() => handleViewRow(params.row?.id)}
            />
          ]
    }
  ];

  const getTogglableColumns = () =>
    columns
      .filter(column => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map(column => column.field);

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CustomBreadcrumbs
          heading="Lista"
          links={[
            { name: 'Painel', href: paths.admin.root },
            {
              name: 'Reserva',
              href: paths.admin.root
            },
            { name: 'Lista' }
          ]}
          action={
            <Button
              component={RouterLink}
              href={isAdmin ? paths.admin.reservation.new : paths.guest.root}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nova Reserva
            </Button>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5
            }
          }}
        />

        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' }
          }}
        >
          {isSmallScreen && !isAdmin ?
            <MobileTable rows={tableData} columns={columns} />
          : <DataGrid
              checkboxSelection
              disableRowSelectionOnClick
              rows={dataFiltered}
              columns={columns}
              loading={reservationsLoading}
              getRowHeight={() => 'auto'}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    feature: false,
                    diameter: false,
                    antiReflectionType: false,
                    residualColor: false,
                    blueFilter: false,
                    subscription: false,
                    additionalStarts: false,
                    additionalEnds: false,
                    sphericalStarts: false,
                    sphericalEnds: false,
                    cylindricalLimitStarts: false,
                    cylindricalLimitEnds: false,
                    maxHeight: false,
                    minHeight: false
                  }
                },
                pagination: {
                  paginationModel: { pageSize: 10 }
                }
              }}
              onRowSelectionModelChange={newSelectionModel => {
                setSelectedRowIds(newSelectionModel);
              }}
              slots={{
                toolbar: () => (
                  <>
                    <GridToolbarContainer>
                      <ReservationTableToolbar
                        filters={filters}
                        onFilters={handleFilters}
                      />

                      <GridToolbarQuickFilter />

                      <Stack
                        spacing={1}
                        flexGrow={1}
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        {!!selectedRowIds.length && (
                          <Button
                            size="small"
                            color="error"
                            startIcon={
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            }
                            onClick={confirmRows.onTrue}
                          >
                            Excluir ({selectedRowIds.length})
                          </Button>
                        )}

                        <GridToolbarColumnsButton />
                        <GridToolbarFilterButton />
                      </Stack>
                    </GridToolbarContainer>

                    {canReset && (
                      <ReservationTableFiltersResult
                        filters={filters}
                        onFilters={handleFilters}
                        onResetFilters={handleResetFilters}
                        results={dataFiltered.length}
                        sx={{ p: 2.5, pt: 0 }}
                      />
                    )}
                  </>
                ),
                noRowsOverlay: () => <EmptyContent title="Nenhum dado" />,
                noResultsOverlay: () => (
                  <EmptyContent title="Nenhum resultado encontrado" />
                )
              }}
              slotProps={{
                columnsPanel: {
                  getTogglableColumns
                }
              }}
            />
          }
        </Card>
      </Container>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Excluir"
        content={
          <>
            Tem certeza de que deseja excluir{' '}
            <strong> {selectedRowIds.length} </strong> itens?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Excluir
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters
}: {
  inputData: IReservationItem[];
  filters: IReservationTableFilters;
}) {
  const { status } = filters;

  if (status.length) {
    inputData = inputData.filter(reservation =>
      status.includes(reservation?.status)
    );
  }

  return inputData;
}
