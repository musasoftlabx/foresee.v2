"use client";

// * React
import { useEffect, useState } from "react";

// * NextJS
import Image from "next/image";

// * NPM
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// * MUI
import { Box, Button, IconButton, Stack, useColorScheme } from "@mui/material";
import { green } from "@mui/material/colors";
import {
  DataGridPro,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridPreProcessEditCellProps,
  GridRowModel,
  useGridApiRef,
} from "@mui/x-data-grid-pro";

// * Hooks
import useCustomDataGrid from "@/hooks/useCustomDataGrid";
import useJWT from "@/hooks/useJWT";

// * Store
//import { useConfirmStore } from "@/store/useAlertStore";

// * Components
import { DataGridStyles } from "@/components/DataTable/DataGridStyles";
import { sx } from "@/components/DataTable/DataGridToolbar";
import AddUser from "@/components/Modals/AddUser";
import AppDrawer from "@/components/Layouts/AppDrawer";
import DataGridPagination from "@/components/DataTable/DataGridPagination";
import PageNavigator from "@/components/Layouts/PageNavigator";
import {
  DataGridDelete,
  DataGridSwitch,
} from "@/components/DataTable/DataGridCustomElements";
import {
  DataGridSlotProps,
  DataGridSlots,
} from "@/components/DataTable/DataGridSlots";
import {
  booleanFilter,
  dateFilter,
} from "@/components/DataTable/DataGridFilters";

// * Icons
import { AiOutlineUnlock } from "react-icons/ai";
import { FaUsersCog } from "react-icons/fa";
import { Ballot } from "../../../../types";

// * Constants
const apiUrl = "ballots";

//console.log(await serverProps());

export default function Ballots() {
  // ? Refs
  const apiRef = useGridApiRef();
  const permissions: { readWriteRoles: string[]; readWriteUsers: string[] } = {
    readWriteRoles: [],
    readWriteUsers: [],
  };

  // ? Hooks
  //const showConfirm = useConfirmStore((state) => state.alert);
  const { profile } = useJWT();
  const {
    initialState,
    columnVisibilityModel,
    filters,
    filterModel,
    paginationModel,
    pinnedColumnsModel,
    rowSelectionModel,
    sortModel,
    stats,
    syncState,
    changeRowSelection,
    changeVisibleColumns,
    changeFilters,
    changePagination,
    changePinnedColumns,
    changeSorting,
    changeStats,
    handleGetData,
    updateCell,
  } = useCustomDataGrid({
    apiRef,
    apiUrl,
    toHide: { id: true },
    toSort: [{ field: "id", sort: "desc" }],
    toPin: {
      left: [GRID_CHECKBOX_SELECTION_COL_DEF.field, "id", "username"],
      right: ["isActive", "actions"],
    },
  });

  // ? States
  const [isExporting, setIsExporting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageUserRolesOpen, setIsManageUserRolesOpen] = useState(false);

  // ? Effects
  useEffect(() => {
    apiRef.current?.restoreState({
      columns: {
        dimensions: initialState?.columns?.dimensions,
        orderedFields: initialState?.columns?.orderedFields,
      },
    });
  });

  // ? Queries
  const { data, isLoading } = useQuery({
    queryKey: [
      apiUrl,
      paginationModel?.pageSize,
      paginationModel?.page,
      "display",
      encodeURI(JSON.stringify({ filterModel, sortModel })),
    ],
    queryFn: ({ queryKey }) =>
      axios.get(
        `${queryKey[0]}?limit=${queryKey[1]}&offset=${queryKey[2]}&view=${queryKey[3]}&options=${queryKey[4]}&scope=ballots`
      ),
    enabled: JSON.stringify({ filterModel, sortModel }) !== "{}",
    select: ({
      data,
    }: {
      data: { count: number; dataset: Pick<Ballot, "ballot">[] };
    }) => data,
  });

  const { mode, setMode } = useColorScheme();

  return (
    <AppDrawer>
      <PageNavigator
        dataset={data?.dataset ?? []}
        count={data?.count ?? 0}
        heading="Ballots"
        subheading={`${data?.count !== 1 ? apiUrl : apiUrl.slice(0, -1)}`}
        canRefresh
      />

      <Box sx={{ height: `calc(100vh - 190px)` }}>
        <DataGridPro
          apiRef={apiRef}
          rows={data?.dataset ?? []}
          rowCount={data?.count ?? 0}
          initialState={initialState}
          columns={[
            {
              field: GRID_CHECKBOX_SELECTION_COL_DEF.field,
              align: "center",
              disableColumnMenu: true,
              filterable: false,
              hideable: true,
              resizable: false,
              sortable: false,
              width: 40,
            },
            {
              field: "_id",
              headerName: "Id.",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              width: 70,
            },
            {
              field: "ballot",
              headerName: "Ballot",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              width: 125,
            },
            {
              field: "name",
              headerName: "Ballot Name",
              filterable: false,
              sortable: false,
              width: 300,
            },
            {
              field: "color",
              headerName: "Color",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              width: 125,
            },
            {
              field: "startsOn",
              headerName: "Starts On",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              width: 125,
            },
            {
              field: "endsOn",
              headerName: "Ends On",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              width: 125,
            },
          ]}
          checkboxSelection
          getRowId={({ _id }) => _id}
          isRowSelectable={({ row: { isActive } }) => isActive}
          pagination
          keepNonExistentRowsSelected
          disableRowSelectionOnClick
          showCellVerticalBorder
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
          filterMode="server"
          paginationMode="server"
          sortingMode="server"
          loading={isLoading}
          // columnVisibilityModel={columnVisibilityModel}
          filterModel={filterModel}
          // paginationModel={paginationModel}
          // pinnedColumns={pinnedColumnsModel}
          // rowSelectionModel={rowSelectionModel}
          // sortModel={sortModel}
          onColumnOrderChange={syncState}
          onColumnResize={syncState}
          onColumnVisibilityModelChange={(model) => changeVisibleColumns(model)}
          onFilterModelChange={(model) => changeFilters(model)}
          onPaginationModelChange={(model) => changePagination(model)}
          onPinnedColumnsChange={(model) => changePinnedColumns(model)}
          onRowSelectionModelChange={(model) => changeRowSelection(model)}
          onSortModelChange={(model) => changeSorting(model)}
          processRowUpdate={(newRow: GridRowModel, oldRow: GridRowModel) =>
            updateCell({
              newRow,
              oldRow,
              url: `${apiUrl}?scope=users`,
            })
          }
          slots={DataGridSlots({
            apiRef,
            apiUrl: `${apiUrl}?scope=users`,
            changeFilters,
            changeRowSelection,
            exclude: ["multiApprove", "multiReject"],
            exportURL: `${apiUrl}?scope=users&limit=${data?.count}&offset=${
              paginationModel?.page
            }&view=export&options=${encodeURI(
              JSON.stringify({ filterModel, sortModel })
            )}`,
            handleGetData,
            isExporting,
            isLoading,
            search: {
              fields: "Id, Username, Dealer, Names, Phone etc ...",
              width: 450,
            },
            setIsExporting,
            stats,
            changeStats,
            setIsAddModalOpen,
            extraActions: (
              <Button
                size="small"
                startIcon={<FaUsersCog />}
                onClick={() => setIsManageUserRolesOpen((prev: any) => !prev)}
                sx={sx}
              >
                Manage Roles
              </Button>
            ),
          })}
          slotProps={DataGridSlotProps}
          sx={DataGridStyles}
        />

        <DataGridPagination
          data={data}
          paginationModel={paginationModel!}
          changePagination={changePagination}
        />
      </Box>
    </AppDrawer>
  );
}
