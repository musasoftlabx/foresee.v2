"use client";

// * React
import { Fragment, useEffect, useState } from "react";

// * NPM
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// * HUI
import { Avatar } from "@heroui/react";

// * SUI
import { Button } from "@/components/ui/shadcn/button";

// * MUI
import { capitalize } from "@mui/material";
import {
  DataGridPro,
  type GridPreProcessEditCellProps,
  type GridRowModel,
  useGridApiRef,
} from "@mui/x-data-grid-pro";

// * Icons
import { Trash2Icon } from "lucide-react";
import { DeleteIcon } from "@/components/ui/lucide-animated/delete";

// * Components
import {
  DataGridSlotProps,
  DataGridSlots,
} from "@/components/DataTable/DataGridSlots";
import { dateFilter } from "@/components/DataTable/DataGridFilters";
import DataGridPagination from "@/components/DataTable/DataGridPagination";
import AddClient from "@/components/modals/add-client";

// * Hooks
import useCustomDataGrid from "@/hooks/useCustomDataGrid";

// * Store
import { useConfirmDialogStore } from "@/store/useConfirmDialogStore";

// * Prisma
import type { Prisma } from "@/generated/prisma/client";

// * Types
import { DataGridApiResponse } from "@/types";

export default function Clients({ apiUrl = "clients" }) {
  // ? Hooks
  const apiRef = useGridApiRef();
  const confirm = useConfirmDialogStore((state) => state.confirm);

  // ? States
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    initialState,
    columnVisibilityModel,
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
    columnsToHide: [
      "id",
      "created.by",
      "created.on",
      "modified.by",
      "modified.on",
    ],
    columnsToSort: [{ field: "id", sort: "desc" }],
    toPin: { left: ["id"], right: ["actions"] },
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

  // ? Queries
  const { data, isLoading } = useQuery({
    queryKey: [
      apiUrl,
      paginationModel?.pageSize,
      paginationModel?.page,
      encodeURI(JSON.stringify({ filterModel, sortModel })),
    ],
    queryFn: ({ queryKey }) =>
      axios(
        `${queryKey[0]}?limit=${queryKey[1]}&offset=${queryKey[2]}&refines=${queryKey[3]}`,
      ),
    select: ({
      data,
    }: {
      data: DataGridApiResponse & { dataset: Prisma.ClientsModel[] };
    }) => data,
    enabled: JSON.stringify({ filterModel, sortModel }) !== "{}",
  });

  return (
    <Fragment>
      <AddClient isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      <div className="flex flex-1 flex-col">
        <DataGridPro
          apiRef={apiRef}
          rows={data?.dataset ?? []}
          rowCount={data?.totalCount ?? 0}
          initialState={initialState}
          columns={[
            {
              field: "id",
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
              field: "name",
              headerName: "Name",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              editable: true,
              hideable: false,
              pinnable: false,
              resizable: true,
              minWidth: 250,
              flex: 1,
              preProcessEditCellProps: ({
                props,
              }: GridPreProcessEditCellProps) => ({
                ...props,
                error: !props.value || props.value.length > 50,
              }),
            },
            {
              field: "added",
              headerName: "Added",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              filterable: false,
              hideable: false,
              pinnable: false,
              resizable: false,
              sortable: false,
              minWidth: 300,
              flex: 1,
              renderCell: ({
                row: {
                  added: { by, on },
                },
              }) => (
                <div className="flex gap-3 items-center">
                  <Avatar
                    isBordered
                    radius="sm"
                    className="size-7"
                    src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                  />
                  <div className="flex-col">
                    <div className="text-sm">by {by}</div>
                    <div className="text-xs">on {on}</div>
                  </div>
                </div>
              ),
            },
            {
              field: "modified",
              headerName: "Modified",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              filterable: false,
              hideable: false,
              pinnable: false,
              resizable: false,
              sortable: false,
              minWidth: 300,
              flex: 1,
              renderCell: ({
                row: {
                  modified: { by, on },
                },
              }) => (
                <div className="flex gap-3 items-center">
                  <Avatar
                    isBordered
                    radius="sm"
                    className="size-7"
                    src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                  />
                  <div className="flex-col">
                    <div className="text-sm">by {by}</div>
                    <div className="text-xs">on {on}</div>
                  </div>
                </div>
              ),
            },
            {
              field: "actions",
              headerName: "Delete",
              headerAlign: "center",
              align: "center",
              sortable: false,
              filterable: false,
              hideable: false,
              pinnable: false,
              disableColumnMenu: true,
              width: 70,
              renderCell: ({ row }) => (
                <div className="flex items-center justify-center gap-3 mt-0.5">
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => {
                      changeRowSelection({
                        type: "include",
                        ids: new Set([row.id]),
                      });
                      confirm({
                        icon: <Trash2Icon />,
                        status: "error",
                        action: "delete",
                        subject: "Confirm deletion",
                        body: `Are you sure you intend to delete client ${row.name}?`,
                      });
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              ),
            },
            { field: "created.by", headerName: "Created By", hideable: false },
            {
              field: "created.on",
              headerName: "Created On",
              hideable: false,
              filterOperators: dateFilter,
            },
            {
              field: "modified.by",
              headerName: "Modified By",
              hideable: false,
            },
            {
              field: "modified.on",
              headerName: "Modified On",
              hideable: false,
              filterOperators: dateFilter,
            },
          ]}
          getRowHeight={() => 40}
          density="compact"
          pagination
          showCellVerticalBorder
          showColumnVerticalBorder
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
            title: capitalize(apiUrl),
            caption: `${data?.filtered} items displayed from a total of ${data?.totalCount}.`,
            changeFilters,
            changeVisibleColumns,
            changeRowSelection,
            clearFilters,
            clearRowSelection,
            exclude: [],
            exportUrl: `${apiUrl}?scope=users&limit=${data?.filtered}&offset=${
              paginationModel?.page
            }&exportable=true&refines=${encodeURI(
              JSON.stringify({ filterModel, sortModel }),
            )}`,
            handleGetData,
            newItemLabel: "Create",
            isExporting,
            isLoading,
            searchPlaceholder: "Name",
            setIsExporting,
            stats,
            changeStats,
            setIsModalOpen,
          })}
          slotProps={DataGridSlotProps}
          sx={(theme) => DataGridSlots({ hideRowBorders: true }).styles(theme)}
        />

        <DataGridPagination
          count={data?.totalCount}
          paginationModel={paginationModel}
          changePagination={changePagination}
        />
      </div>
    </Fragment>
  );
}
