"use client";

import Portal from "../../page";

// * React
import { useEffect, useState } from "react";

// * NPM
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// * HUI
import { Avatar, Button } from "@heroui/react";

// * SCNUI
import { Button as ButtonShadCN } from "@/components/ui/shadcn/button";

// * RUI

import { AddClient } from "@/components/admin/clients/add-client";

// * MUI
import {
  DataGridPro,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridPreProcessEditCellProps,
  GridRowModel,
  GridValidRowModel,
  useGridApiRef,
} from "@mui/x-data-grid-pro";

// * Components
import {
  DataGridSlotProps,
  DataGridSlots,
} from "@/components/DataTable/DataGridSlots";

// * Icons
import { DeleteIcon } from "@/components/ui/lucide-animated/delete";

// * Constants
const apiUrl = "scans";

// * Hooks
import useCustomDataGrid from "@/hooks/useCustomDataGrid";

import { DataGridStyles } from "@/components/DataTable/DataGridStyles";
import DataGridPagination from "@/components/DataTable/DataGridPagination";

import { useDialogStore } from "@/store/useDialogStore";
import { EllipsisHorizontalIcon } from "@/components/ui/heroicons-animated/ellipsis-horizontal";
import { dateFilter } from "@/components/DataTable/DataGridFilters";
import { useParams } from "next/navigation";

type TResponse = {
  count: number;
  dataset: {
    _id: string;
    client: string;
    createdAt: string;
    updatedAt: string;
  };
};

export default function Scans() {
  // ? Hooks
  const apiRef = useGridApiRef();
  const { audit } = useParams();

  const showConfirm = useDialogStore((state) => state.confirm);

  // ? States
  const [isExporting, setIsExporting] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isManageUserRolesOpen, setIsManageUserRolesOpen] = useState(false);
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
    clearRowSelection,
    changeRowSelection,
    changeVisibleColumns,
    changeFilters,
    clearFilters,
    changePagination,
    changePinnedColumns,
    changeSorting,
    changeStats,
    handleGetData,
    updateCell,
  } = useCustomDataGrid({
    apiRef,
    apiUrl,
    columnsToHide: ["_id", "scanned.by", "scanned.on"],
    columnsToSort: [{ field: "_id", sort: "desc" }],
    toPin: {
      left: ["_id", "barcode"],
      right: ["actions"],
    },
  });

  // ? Queries
  const { data, isLoading } = useQuery({
    queryKey: [
      `${apiUrl}/${audit}`,
      paginationModel?.pageSize,
      paginationModel?.page,
      "__DISPLAY__",
      encodeURI(JSON.stringify({ filterModel, sortModel })),
    ],
    queryFn: ({ queryKey }) =>
      axios<GridValidRowModel>(
        `${queryKey[0]}?limit=${queryKey[1]}&offset=${queryKey[2]}&view=${queryKey[3]}&sortsAndFilters=${queryKey[4]}&scope=__DEFAULT__`,
      ),
    select: ({ data }) => data,
    enabled: JSON.stringify({ filterModel, sortModel }) !== "{}",
  });

  // ? Effects
  useEffect(() => {
    apiRef.current?.restoreState({
      columns: {
        dimensions: initialState?.columns?.dimensions,
        orderedFields: initialState?.columns?.orderedFields,
      },
    });
  });

  return (
    <Portal>
      <AddClient
        isAddClientOpen={isAddClientOpen}
        setIsAddClientOpen={setIsAddClientOpen}
      />

      <div className="flex flex-1 flex-col">
        <DataGridPro
          apiRef={apiRef}
          rows={data?.dataset ?? []}
          rowCount={data?.count ?? 0}
          initialState={initialState}
          columns={[
            {
              field: GRID_CHECKBOX_SELECTION_COL_DEF.field,
              align: "center",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              filterable: false,
              hideable: false,
              resizable: false,
              sortable: false,
              maxWidth: 40,
            },
            {
              field: "_id",
              headerName: "Id.",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: false,
              filterable: false,
              hideable: true,
              pinnable: false,
              resizable: false,
              minWidth: 220,
              flex: 1,
            },
            {
              field: "barcode",
              headerName: "Barcode",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              minWidth: 180,
              flex: 1,
            },
            {
              field: "location",
              headerName: "Location",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              minWidth: 150,
              flex: 1,
            },
            {
              field: "scanned",
              headerName: "Scanned",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              filterable: false,
              hideable: false,
              pinnable: false,
              resizable: false,
              sortable: false,
              minWidth: 280,
              flex: 1,
              renderCell: ({
                row: {
                  scanned: { by, on },
                },
              }) => (
                <div className="flex gap-3 items-center py-1">
                  <Avatar
                    isBordered
                    radius="sm"
                    size="sm"
                    src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                  />
                  <div className="flex-col">
                    <div>by {by}</div>
                    <div className="text-xs">on {on}</div>
                  </div>
                </div>
              ),
            },
            {
              field: "device",
              headerName: "Device",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              filterable: false,
              hideable: false,
              pinnable: false,
              resizable: false,
              sortable: false,
              minWidth: 200,
              flex: 1,
              renderCell: ({
                row: {
                  scanned: {
                    device: { model, serialNo },
                  },
                },
              }) => (
                <div className="flex gap-3 items-center">
                  <div className="flex-col">
                    <div>Model {model}</div>
                    <div className="text-xs">SerialNo {serialNo}</div>
                  </div>
                </div>
              ),
            },
            { field: "scanned.by", headerName: "Scanned By", hideable: false },
            {
              field: "scanned.on",
              headerName: "Scanned On",
              hideable: false,
              filterOperators: dateFilter,
            },
          ]}
          getRowId={({ _id }) => _id}
          getRowHeight={() => "auto"}
          density="compact"
          pagination
          keepNonExistentRowsSelected
          disableRowSelectionOnClick
          disableRowSelectionExcludeModel
          showCellVerticalBorder={false}
          showColumnVerticalBorder={false}
          showToolbar
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
          filterMode="server"
          paginationMode="server"
          sortingMode="server"
          loading={isLoading}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(model) => changeVisibleColumns(model)}
          filterModel={filterModel}
          onFilterModelChange={(model) => changeFilters(model)}
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => changePagination(model)}
          pinnedColumns={pinnedColumnsModel}
          onPinnedColumnsChange={(model) => changePinnedColumns(model)}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(model) => changeRowSelection(model)}
          sortModel={sortModel}
          onSortModelChange={(model) => changeSorting(model)}
          onColumnOrderChange={syncState}
          onColumnResize={syncState}
          processRowUpdate={(newRow: GridRowModel, oldRow: GridRowModel) =>
            updateCell({ newRow, oldRow, url: `${apiUrl}?scope=editCell` })
          }
          slots={DataGridSlots({
            apiRef,
            apiUrl: `${apiUrl}?scope=users`,
            changeFilters,
            clearFilters,
            changeRowSelection,
            clearRowSelection,
            changeVisibleColumns,
            exclude: ["add", "columns"],
            exportURL: `${apiUrl}?scope=users&limit=${data?.count}&offset=${
              paginationModel?.page
            }&view=__EXPORT__&options=${encodeURI(
              JSON.stringify({ filterModel, sortModel }),
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
            setIsAddItemOpen: setIsAddClientOpen,
            extraActions: (
              <>
                <ButtonShadCN variant="secondary" size="icon">
                  <EllipsisHorizontalIcon data-icon="inline-start" />
                </ButtonShadCN>
                <ButtonShadCN variant="secondary" size="icon">
                  <EllipsisHorizontalIcon data-icon="inline-start" />
                </ButtonShadCN>
              </>
            ),
          })}
          // <Button
          //   size="small"
          //   startIcon={<FaUsersCog />}
          //   onPress={() => setIsAddClientOpen(true)}
          //   sx={sx}
          // >
          //   Manage Roles
          // </Button>
          slotProps={DataGridSlotProps}
          sx={DataGridStyles}
        />

        <DataGridPagination
          data={data}
          paginationModel={paginationModel!}
          changePagination={changePagination}
        />
      </div>
    </Portal>
  );
}
