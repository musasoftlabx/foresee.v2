"use client";

import Portal from "../page";

// * React
import { Fragment, useEffect, useState } from "react";

import Link from "next/link";

// * NPM
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import capitalize from "lodash/capitalize";

// * HUI
import { Avatar } from "@heroui/react";

// * SUI
import { Button } from "@/components/ui/shadcn/button";

// * RUI

import CreateStore from "@/components/modals/create-store";

// * MUI
import {
  DataGridPro,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  gridDimensionsSelector,
  GridPreProcessEditCellProps,
  GridRowModel,
  GridRowParams,
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
const apiUrl = "audits";

// * Hooks
import useCustomDataGrid from "@/hooks/useCustomDataGrid";

import { DataGridStyles } from "@/components/DataTable/DataGridStyles";
import DataGridPagination from "@/components/DataTable/DataGridPagination";

import { useDialogStore } from "@/store/useAlertDialogStore";
import { EllipsisHorizontalIcon } from "@/components/ui/heroicons-animated/ellipsis-horizontal";
import { dateFilter } from "@/components/DataTable/DataGridFilters";

import {
  ExternalLink,
  ExternalLinkIcon,
  FileSymlinkIcon,
  PackageIcon,
  Table2,
} from "lucide-react";
import dayjs from "dayjs";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import { useParams, useRouter } from "next/navigation";
import { useDayjsDayFormatter } from "@/hooks/useDayjsDayFormatter";
import CreateAudit from "@/components/modals/create-audit";

export default function Audits() {
  // ? Refs
  const apiRef = useGridApiRef();
  const router = useRouter();
  const { store } = useParams();

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
        `${queryKey[0]}?store=${store}&limit=${queryKey[1]}&offset=${queryKey[2]}&refines=${queryKey[3]}`,
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
    <Fragment>
      <CreateAudit
        isAddItemOpen={isAddItemOpen}
        setIsAddItemOpen={setIsAddItemOpen}
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
              minWidth: 20,
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
              minWidth: 90,
              flex: 1,
              renderCell: ({ row: { code } }) => (
                <div className="font-bold">{code}</div>
              ),
            },
            {
              field: "locations",
              headerName: "Locations",
              headerAlign: "center",
              align: "center",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              hideable: false,
              pinnable: true,
              resizable: false,
              minWidth: 90,
              flex: 1,
              renderCell: ({ row: { id, locations } }) => (
                <Button
                  variant="link"
                  onClick={() =>
                    router.push(
                      `/portal/stores/${store}/audits/${id}/locations`,
                    )
                  }
                >
                  <span className="flex gap-1 underline decoration-dashed">
                    {locations}
                    <ExternalLink size={8} />
                  </span>
                </Button>
              ),
            },
            {
              field: "scans",
              headerName: "Scans",
              headerAlign: "center",
              align: "center",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              hideable: false,
              pinnable: true,
              resizable: false,
              minWidth: 90,
              flex: 1,
              renderCell: ({ row: { id, scans } }) => (
                <Button
                  variant="link"
                  onClick={() =>
                    router.push(`/portal/stores/${store}/audits/${id}/scans`)
                  }
                >
                  <span className="flex gap-1 underline decoration-dashed">
                    {scans}
                    <ExternalLink size={8} />
                  </span>
                </Button>
              ),
            },
            {
              field: "date",
              headerName: "Date of Audit",
              headerAlign: "center",
              align: "center",
              cellClassName: "vertical-center-cell",
              type: "dateTime",
              disableColumnMenu: false,
              editable: true,
              hideable: false,
              pinnable: true,
              resizable: false,
              minWidth: 220,
              flex: 1,
              valueGetter: ({ value }) =>
                value ? dayjs(value).toDate() : null,
              renderCell: ({ row: { date } }) => (
                <span className="text-xs">{useDayjsDayFormatter(date)}</span>
              ),
            },
            {
              field: "barcode.mode",
              headerAlign: "center",
              align: "center",
              cellClassName: "vertical-center-cell",
              type: "singleSelect",
              valueOptions: ["Strict", "Varies"],
              disableColumnMenu: true,
              editable: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              minWidth: 90,
              flex: 1,
              renderHeader: () => (
                <div className="flex flex-col items-center font-bold">
                  <div className="text-xs">Barcode</div>
                  <div className="text-xs">Mode</div>
                </div>
              ),
              renderCell: ({
                row: {
                  barcode: { mode },
                },
              }) => <div>{capitalize(mode)}</div>,
            },
            {
              field: "barcode.characters",
              headerAlign: "center",
              align: "center",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              editable: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              minWidth: 90,
              flex: 1,
              renderHeader: () => (
                <div className="flex flex-col items-center font-bold">
                  <div className="text-xs">Barcode</div>
                  <div className="text-xs">Characters</div>
                </div>
              ),
              renderCell: ({
                row: {
                  barcode: { characters },
                },
              }) => <div>{characters}</div>,
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
              headerName: "Actions",
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
    </Fragment>
  );
}
