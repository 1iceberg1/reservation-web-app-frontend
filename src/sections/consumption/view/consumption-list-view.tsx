'use client';

import React, { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowSelectionModel,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';
import { fCurrency } from 'src/utils/format-number';

import { useGetConsumptions } from 'src/api/consumption';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IConsumptionItem } from 'src/types/consumption';

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

// ----------------------------------------------------------------------

export default function ConsumptionListView() {
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();

  const router = useRouter();

  const settings = useSettingsContext();

  const { consumptions, consumptionsLoading } = useGetConsumptions();

  const [tableData, setTableData] = useState<IConsumptionItem[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>(
    []
  );

  useEffect(() => {
    if (consumptions.length) {
      setTableData(consumptions);
    }
  }, [consumptions]);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios.delete(endpoints.consumption, { params: { ids: [id] } });
      const deleteRow = tableData.filter(row => row.id !== id);

      enqueueSnackbar('Excluir sucesso!');

      setTableData(deleteRow);
    },
    [enqueueSnackbar, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    await axios.delete(endpoints.consumption, {
      params: { ids: selectedRowIds },
    });
    const deleteRows = tableData.filter(
      row => !selectedRowIds.includes(row.id)
    );

    enqueueSnackbar('Excluir sucesso!');

    setTableData(deleteRows);
  }, [enqueueSnackbar, selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.admin.consumption.edit(id));
    },
    [router]
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nome',
      width: 180,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      maxWidth: 160,
      renderCell: params => <>{fCurrency(params.row?.price)}</>,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: 'Ações',
      align: 'right',
      headerAlign: 'right',
      maxWidth: 80,
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: params => [
        <GridActionsCellItem
          key={params.row?.id}
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Editar"
          onClick={() => handleEditRow(params.row?.id)}
        />,
        <GridActionsCellItem
          key={params.row?.id}
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Excluir"
          onClick={() => {
            handleDeleteRow(params.row?.id);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
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
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="Lista"
          links={[
            { name: 'Painel', href: paths.admin.root },
            {
              name: 'Consumption',
              href: paths.admin.consumption.root,
            },
            { name: 'Lista' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.consumption.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Novo Consumption
            </Button>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        <Card
          sx={{
            height: { xs: 800, md: 200 },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={tableData}
            columns={columns}
            loading={consumptionsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            onRowSelectionModelChange={newSelectionModel => {
              setSelectedRowIds(newSelectionModel);
            }}
            slots={{
              toolbar: () => (
                <GridToolbarContainer>
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
                    {/* <GridToolbarExport /> */}
                  </Stack>
                </GridToolbarContainer>
              ),
              noRowsOverlay: () => <EmptyContent title="Nenhum dado" />,
              noResultsOverlay: () => (
                <EmptyContent title="Nenhum resultado encontrado" />
              ),
            }}
            slotProps={{
              columnsPanel: {
                getTogglableColumns,
              },
            }}
          />
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
