"use client";

// * React
import { Fragment, useEffect, useState } from "react";

// * Next
import { useParams } from "next/navigation";

// * NPM
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import capitalize from "lodash/capitalize";
import JsBarcode from "jsbarcode";

// * HUI
import { Avatar } from "@heroui/react";

// * SUI
import { Button } from "@/components/ui/shadcn/button";
import { Checkbox } from "@/components/ui/shadcn/checkbox";

// * MUI
import {
  type GridRowModel,
  type GridPreProcessEditCellProps,
  type GridState,
  DataGridPro,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  useGridApiRef,
} from "@mui/x-data-grid-pro";

// * Components
import {
  DataGridSlotProps,
  DataGridSlots,
} from "@/components/DataTable/DataGridSlots";
import { dateFilter } from "@/components/DataTable/DataGridFilters";
import CreateAudit from "@/components/modals/create-audit";
import DataGridPagination from "@/components/DataTable/DataGridPagination";

// * Icons
import { DeleteIcon } from "@/components/ui/lucide-animated/delete";

// * Hooks
import useCustomDataGrid from "@/hooks/useCustomDataGrid";

// * Store
import { useConfirmDialogStore } from "@/store/useConfirmDialogStore";

// * Icons
import { Trash2Icon } from "lucide-react";

// * Prisma
import type { Prisma } from "@/generated/prisma/client";

export default function Audits({ apiUrl = "locations" }) {
  // ? Refs
  const apiRef = useGridApiRef();
  const { audit } = useParams();

  const confirm = useConfirmDialogStore((state) => state.confirm);

  // ? States
  const [isExporting, setIsExporting] = useState(false);
  const [isAddItemOpen, setIsNewItemOpen] = useState(false);
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
      left: [GRID_CHECKBOX_SELECTION_COL_DEF.field, "id", "code", "barcode"],
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
        `${queryKey[0]}?audit=${audit}&limit=${queryKey[1]}&offset=${queryKey[2]}&refines=${queryKey[3]}`,
      ),
    select: ({
      data,
    }: {
      data: {
        dataset: Prisma.LocationsModel[];
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
    <Fragment>
      <CreateAudit
        isNewItemOpen={isAddItemOpen}
        setIsNewItemOpen={setIsNewItemOpen}
      />

      <div className="flex flex-1 flex-col h-[calc(100vh-585px)]">
        <DataGridPro
          apiRef={apiRef}
          rows={data?.dataset ?? []}
          rowCount={data?.totalCount ?? 0}
          autoPageSize
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
              field: "code",
              headerName: "Code",
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
              minWidth: 100,
              flex: 1,
              renderCell: ({ row: { code } }) => (
                <svg id={code} className="barcode-svg h-10" />
              ),
            },
            {
              field: "physicalCount",
              headerName: "Physical Count",
              headerAlign: "center",
              align: "center",
              cellClassName: "vertical-center-cell",
              type: "number",
              disableColumnMenu: true,
              editable: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              minWidth: 125,
              flex: 1,
              preProcessEditCellProps: (
                params: GridPreProcessEditCellProps,
              ) => ({
                ...params.props,
                error: !params.props.value || params.props.value.length > 3,
              }),
            },
            {
              field: "systemCount",
              headerName: "System Count",
              headerAlign: "center",
              align: "center",
              cellClassName: "vertical-center-cell",
              type: "number",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              minWidth: 120,
              flex: 1,
            },
            {
              field: "discrepancy",
              headerName: "Discrepancy",
              headerAlign: "center",
              align: "center",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              minWidth: 110,
              flex: 1,
            },
            {
              field: "isVerified",
              headerName: "Is Verified?",
              headerAlign: "center",
              align: "center",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              minWidth: 100,
              flex: 1,
              renderCell: ({ row: { isVerified } }) => (
                <Checkbox checked={isVerified} disabled />
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
                      body: `Are you sure you intend to delete location ${row.code}?`,
                    });
                  }}
                >
                  <DeleteIcon />
                </Button>
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
          //getRowHeight={() => 40}
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
          onStateChange={(state: GridState) => {
            const elements = document.getElementsByClassName("barcode-svg");
            if (elements.length > 0 && state.rows.totalRowCount > 0) {
              setTimeout(() => {
                Object.values(state.rows.dataRowIdToModelLookup).map(
                  ({ code }) =>
                    JsBarcode(`#${code}`, code.split("-")[0], {
                      width: 1,
                      height: 20,
                      textPosition: "top",
                      fontSize: 12,
                      margin: 3,
                    }),
                );
              }, 500);
            }
          }}
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
            searchPlaceholder: "Code, Barcode",
            setIsExporting,
            stats,
            changeStats,
            setIsNewItemOpen,
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
    </Fragment>
  );
}
