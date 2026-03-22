"use client";

// * React
import { Fragment, useEffect, useState } from "react";

// * Next
import { useRouter } from "next/navigation";

// * NPM
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// * HUI
import { Avatar } from "@heroui/react";

// * SUI
import { Button } from "@/components/ui/shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";

// * MUI
import { capitalize } from "@mui/material";
import {
  DataGridPro,
  type GridPreProcessEditCellProps,
  type GridRowModel,
  useGridApiRef,
} from "@mui/x-data-grid-pro";

// * Icons
import { ExternalLink, Trash2Icon } from "lucide-react";
import { DeleteIcon } from "@/components/ui/lucide-animated/delete";

// * Components
import {
  DataGridSlotProps,
  DataGridSlots,
} from "@/components/DataTable/DataGridSlots";
import { dateFilter } from "@/components/DataTable/DataGridFilters";
import DataGridPagination from "@/components/DataTable/DataGridPagination";
import CreateStore from "@/components/modals/create-store";

// * Hooks
import useCustomDataGrid from "@/hooks/useCustomDataGrid";

// * Store
import { useConfirmDialogStore } from "@/store/useConfirmDialogStore";

// * Prisma
import type { Prisma } from "@/generated/prisma/client";

export default function Stores({ apiUrl = "stores" }) {
  // ? Hooks
  const apiRef = useGridApiRef();
  const router = useRouter();
  const confirm = useConfirmDialogStore((state) => state.confirm);

  // ? States
  const [isExporting, setIsExporting] = useState(false);
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
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
    columnsToHide: [
      "id",
      "created.by",
      "created.on",
      "modified.by",
      "modified.on",
    ],
    columnsToSort: [{ field: "id", sort: "desc" }],
    toPin: { left: ["id", "code"], right: ["actions"] },
  });

  // ? Effects
  useEffect(() => {
    apiRef.current?.restoreState({
      columns: {
        dimensions: initialState?.columns?.dimensions,
        orderedFields: initialState?.columns?.orderedFields,
      },
    });
    //console.log(apiRef.current?.getRowsCount());
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
      data: { count: number; dataset: Prisma.StoresModel[] };
    }) => data,
    enabled: JSON.stringify({ filterModel, sortModel }) !== "{}",
  });

  return (
    <Fragment>
      <CreateStore
        isNewItemOpen={isNewItemOpen}
        setIsNewItemOpen={setIsNewItemOpen}
      />

      <div className="flex flex-1 flex-col">
        <DataGridPro
          apiRef={apiRef}
          rows={data?.dataset ?? []}
          rowCount={data?.count ?? 0}
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
              field: "code",
              headerName: "Code",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              minWidth: 80,
              flex: 1,
              renderCell: ({ row }) => (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="link"
                      onClick={() => router.push(`/portal/stores/${row.id}`)}
                      className="pl-0"
                    >
                      <span className="flex gap-1 underline decoration-dashed text-chart-1">
                        {row.code}
                        <ExternalLink size={8} />
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">View Audits</TooltipContent>
                </Tooltip>
              ),
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
              field: "country",
              headerName: "Country",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: true,
              minWidth: 150,
              flex: 1,
            },
            {
              field: "client",
              headerName: "Client",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: true,
              minWidth: 150,
              flex: 1,
            },
            {
              field: "inventoryCount",
              headerName: "Inventory",
              headerAlign: "center",
              align: "center",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              hideable: true,
              pinnable: true,
              resizable: false,
              sortable: false,
              minWidth: 120,
              flex: 1,
              renderCell: ({ row: { id, inventoryCount } }) => (
                <Button
                  variant="link"
                  onClick={() => router.push(`/portal/stores/${id}/inventory`)}
                >
                  <span className="flex gap-1 underline decoration-dashed text-chart-1">
                    {inventoryCount} items
                    <ExternalLink size={10} />
                  </span>
                </Button>
              ),
            },
            {
              field: "created",
              headerName: "Created",
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
                  created: { by, on },
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
                        body: `Are you sure you intend to delete store ${row.name}?`,
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
            caption: `${data?.count} items displayed from a total of ${data?.count}.`,
            changeFilters,
            changeVisibleColumns,
            changeRowSelection,
            clearFilters,
            clearRowSelection,
            exclude: [],
            exportUrl: `${apiUrl}?scope=users&limit=${data?.count}&offset=${
              paginationModel?.page
            }&exportable=true&refines=${encodeURI(
              JSON.stringify({ filterModel, sortModel }),
            )}`,
            handleGetData,
            newItemLabel: "Create",
            isExporting,
            isLoading,
            searchPlaceholder: "Code, Name, Country, Client",
            setIsExporting,
            stats,
            changeStats,
            setIsNewItemOpen,
          })}
          slotProps={DataGridSlotProps}
          sx={(theme) => DataGridSlots({ hideRowBorders: false }).styles(theme)}
        />

        <DataGridPagination
          count={data?.count}
          paginationModel={paginationModel}
          changePagination={changePagination}
        />
      </div>
    </Fragment>
  );
}
