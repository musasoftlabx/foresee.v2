"use client";

// * React
import { useEffect, useState } from "react";

// * Next
import { useParams } from "next/navigation";

// * NPM
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import capitalize from "lodash/capitalize";

// * MUI
import {
  type GridRowModel,
  type GridState,
  DataGridPro,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridCellProps,
  useGridApiRef,
} from "@mui/x-data-grid-pro";

// * Components
import {
  DataGridSlotProps,
  DataGridSlots,
} from "@/components/DataTable/DataGridSlots";
import DataGridPagination from "@/components/DataTable/DataGridPagination";

// * Hooks
import useCustomDataGrid from "@/hooks/useCustomDataGrid";

// * Prisma
import type { Prisma } from "@/generated/prisma/client";
import { GridColDefPro } from "@mui/x-data-grid-pro/typeOverloads";

export default function Inventory({ apiUrl = "inventory" }) {
  // ? Refs
  const apiRef = useGridApiRef();
  const { store } = useParams();

  // ? States
  const [isExporting, setIsExporting] = useState(false);
  const [columns, setColumns] = useState<GridColDefPro>();

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
    toPin: {
      left: [GRID_CHECKBOX_SELECTION_COL_DEF.field, "id", "barcode"],
      right: ["actions"],
    },
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
        `${queryKey[0]}?store=${store}&limit=${queryKey[1]}&offset=${queryKey[2]}&refines=${queryKey[3]}`,
      ),
    select: ({
      data,
    }: {
      data: {
        dataset: Prisma.InventoryModel[];
        filtered: number;
        totalCount: number;
      };
    }) => data,
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
    <div className="flex flex-1 flex-col h-[calc(100vh-585px)]">
      <DataGridPro
        apiRef={apiRef}
        rows={data?.dataset ?? []}
        rowCount={data?.totalCount ?? 0}
        autoPageSize
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
            field: "name",
            headerName: "Name",
            cellClassName: "vertical-center-cell",
            disableColumnMenu: true,
            hideable: true,
            pinnable: true,
            resizable: true,
            minWidth: 250,
            flex: 1,
          },
          {
            field: "color",
            headerName: "Color",
            headerAlign: "center",
            align: "center",
            cellClassName: "vertical-center-cell",
            disableColumnMenu: true,
            hideable: true,
            pinnable: true,
            resizable: true,
            minWidth: 50,
            flex: 1,
          },
          {
            field: "length",
            headerName: "Length",
            headerAlign: "center",
            align: "center",
            cellClassName: "vertical-center-cell",
            disableColumnMenu: true,
            hideable: true,
            pinnable: true,
            resizable: true,
            minWidth: 50,
            flex: 1,
          },
          {
            field: "size",
            headerName: "Size",
            headerAlign: "center",
            align: "center",
            cellClassName: "vertical-center-cell",
            disableColumnMenu: true,
            hideable: true,
            pinnable: true,
            resizable: true,
            minWidth: 50,
            flex: 1,
          },
          {
            field: "specialCode",
            headerName: "Special Code",
            headerAlign: "center",
            align: "center",
            cellClassName: "vertical-center-cell",
            disableColumnMenu: true,
            hideable: true,
            pinnable: true,
            resizable: true,
            minWidth: 50,
            flex: 1,
          },
        ]}
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
          searchPlaceholder: "Barcode",
          setIsExporting,
          stats,
          changeStats,
        })}
        slotProps={DataGridSlotProps}
        sx={(theme) => DataGridSlots({ hideRowBorders: false }).styles(theme)}
      />

      <DataGridPagination
        count={data?.totalCount}
        paginationModel={paginationModel}
        changePagination={changePagination}
      />
    </div>
  );
}
