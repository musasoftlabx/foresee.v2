"use client";

// * React
import { Fragment, useEffect, useState } from "react";

// * Next
import { useParams } from "next/navigation";

// * NPM
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import JsBarcode from "jsbarcode";

// * HUI
import { Avatar } from "@heroui/react";

// * SCNUI
import { Button } from "@/components/ui/shadcn/button";

// * MUI
import {
  DataGridPro,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  gridDimensionsSelector,
  GridPreProcessEditCellProps,
  GridRowModel,
  GridRowParams,
  GridState,
  GridValidRowModel,
  useGridApiContext,
  useGridApiRef,
  useGridSelector,
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
import { useDialogStore } from "@/store/useAlertDialogStore";
import { EllipsisHorizontalIcon } from "@/components/ui/heroicons-animated/ellipsis-horizontal";
import { dateFilter } from "@/components/DataTable/DataGridFilters";

export default function Scans() {
  // ? Hooks
  const apiRef = useGridApiRef();
  const { audit } = useParams();

  const showConfirm = useDialogStore((state) => state.confirm);

  // ? States
  const [isExporting, setIsExporting] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
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
    columnsToHide: [],
    columnsToSort: [{ field: "quantity", sort: "desc" }],
    toPin: { left: [], right: ["actions"] },
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
      axios<GridValidRowModel>(
        `${queryKey[0]}?audit=${audit}&limit=${queryKey[1]}&offset=${queryKey[2]}&refines=${queryKey[3]}`,
      ),
    select: ({ data }) => data,
    enabled: JSON.stringify({ filterModel, sortModel }) !== "{}",
  });

  return (
    <Fragment>
      {/* <div className="grid grid-cols-2 gap-5"> */}
      <div className="flex mb-5">
        <div className="flex flex-1 flex-col w-2/3 h-[40vh]">
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
                field: "id",
                headerName: "Id.",
                cellClassName: "vertical-center-cell",
                disableColumnMenu: false,
                filterable: false,
                hideable: true,
                pinnable: false,
                resizable: false,
                minWidth: 20,
                flex: 1,
              },
              {
                field: "location",
                headerName: "Location",
                cellClassName: "vertical-center-cell",
                disableColumnMenu: true,
                hideable: true,
                pinnable: false,
                resizable: false,
                minWidth: 180,
                flex: 1,
              },
              {
                field: "barcode",
                headerName: "Barcode",
                headerAlign: "center",
                align: "center",
                cellClassName: "vertical-center-cell",
                disableColumnMenu: false,
                filterable: false,
                hideable: true,
                pinnable: true,
                resizable: false,
                minWidth: 200,
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
                minWidth: 300,
                flex: 1,
                renderCell: ({
                  row: {
                    scanned: { by, on },
                  },
                }) => (
                  <div className="flex gap-3 items-center">
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
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => {
                      changeRowSelection({
                        type: "include",
                        ids: new Set([row.id]),
                      });
                      // showConfirm({
                      //   operation: "delete",
                      //   status: "info",
                      //   subject: `Confirm deletion of ${row.name}`,
                      //   body: `Are you sure you intend to delete this store?`,
                      // });
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                ),
              },
              {
                field: "scanned.by",
                headerName: "Scanned By",
                hideable: false,
              },
              {
                field: "scanned.on",
                headerName: "Scanned On",
                hideable: false,
                filterOperators: dateFilter,
              },
            ]}
            getRowHeight={() => "auto"}
            density="compact"
            pagination
            checkboxSelection
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
            onColumnVisibilityModelChange={(model) =>
              changeVisibleColumns(model)
            }
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
              exclude: ["add", "filter", "multiApprove", "multiReject"],
              exportURL: `${apiUrl}?scope=users&limit=${data?.count}&offset=${
                paginationModel?.page
              }&view=__EXPORT__&sortsAndFilters=${encodeURI(
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
              setIsAddItemOpen,
              extraActions: (
                <>
                  <Button variant="secondary" size="icon">
                    <EllipsisHorizontalIcon data-icon="inline-start" />
                  </Button>
                  <Button variant="secondary" size="icon">
                    <EllipsisHorizontalIcon data-icon="inline-start" />
                  </Button>
                </>
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
        </div>

        <div className="flex flex-1 flex-col w-1/3 h-[40vh]">
          <DataGridPro
            apiRef={apiRef}
            rows={data?.dataset ?? []}
            rowCount={data?.count ?? 0}
            initialState={initialState}
            columns={[
              {
                field: "barcode",
                headerName: "Barcode",
                cellClassName: "vertical-center-cell",
                disableColumnMenu: false,
                filterable: false,
                hideable: true,
                pinnable: true,
                resizable: false,
                minWidth: 200,
                flex: 1,
              },
              {
                field: "quantity",
                headerName: "Qty",
                cellClassName: "vertical-center-cell",
                disableColumnMenu: true,
                hideable: true,
                pinnable: false,
                resizable: false,
                minWidth: 180,
                flex: 1,
              },
            ]}
            getRowId={({ barcode }) => barcode}
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
            onColumnVisibilityModelChange={(model) =>
              changeVisibleColumns(model)
            }
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
              //exclude: ["multiApprove", "multiReject"],
              exportURL: `${apiUrl}?scope=users&limit=${data?.count}&offset=${
                paginationModel?.page
              }&view=__EXPORT__&sortsAndFilters=${encodeURI(
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
              setIsAddItemOpen,
              extraActions: (
                <>
                  <Button variant="secondary" size="icon">
                    <EllipsisHorizontalIcon data-icon="inline-start" />
                  </Button>
                  <Button variant="secondary" size="icon">
                    <EllipsisHorizontalIcon data-icon="inline-start" />
                  </Button>
                </>
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
        </div>
      </div>

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
              field: "id",
              headerName: "Id.",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: false,
              filterable: false,
              hideable: true,
              pinnable: false,
              resizable: false,
              minWidth: 20,
              flex: 1,
            },
            {
              field: "location",
              headerName: "Location",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              hideable: true,
              pinnable: false,
              resizable: false,
              minWidth: 180,
              flex: 1,
            },
            {
              field: "barcode",
              headerName: "Barcode",
              headerAlign: "center",
              align: "center",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: false,
              filterable: false,
              hideable: true,
              pinnable: true,
              resizable: false,
              minWidth: 200,
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
              minWidth: 300,
              flex: 1,
              renderCell: ({
                row: {
                  scanned: { by, on },
                },
              }) => (
                <div className="flex gap-3 items-center">
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
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    changeRowSelection({
                      type: "include",
                      ids: new Set([row.id]),
                    });
                    // showConfirm({
                    //   operation: "delete",
                    //   status: "info",
                    //   subject: `Confirm deletion of ${row.name}`,
                    //   body: `Are you sure you intend to delete this store?`,
                    // });
                  }}
                >
                  <DeleteIcon />
                </Button>
              ),
            },
            {
              field: "scanned.by",
              headerName: "Scanned By",
              hideable: false,
            },
            {
              field: "scanned.on",
              headerName: "Scanned On",
              hideable: false,
              filterOperators: dateFilter,
            },
          ]}
          getRowHeight={() => "auto"}
          density="compact"
          pagination
          checkboxSelection
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
            exclude: ["add", "filter", "multiApprove", "multiReject"],
            exportURL: `${apiUrl}?scope=users&limit=${data?.count}&offset=${
              paginationModel?.page
            }&view=__EXPORT__&sortsAndFilters=${encodeURI(
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
            setIsAddItemOpen,
            extraActions: (
              <>
                <Button variant="secondary" size="icon">
                  <EllipsisHorizontalIcon data-icon="inline-start" />
                </Button>
                <Button variant="secondary" size="icon">
                  <EllipsisHorizontalIcon data-icon="inline-start" />
                </Button>
              </>
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
      </div>
    </Fragment>
  );
}
