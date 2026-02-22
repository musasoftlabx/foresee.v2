"use client";

import Portal from "../page";

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
//import { Button } from "@/components/ui/reui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTable,
  CardTitle,
  CardToolbar,
} from "@/components/ui/reui/card";
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
import { Plus } from "lucide-react";
import { FaUsersCog } from "react-icons/fa";
import { DeleteIcon } from "@/components/ui/lucide-animated/delete";

// * Constants
const apiUrl = "clients";

// * Hooks
import useCustomDataGrid from "@/hooks/useCustomDataGrid";
import useJWT from "@/hooks/useJWT";

import { DataGridStyles } from "@/components/DataTable/DataGridStyles";
import DataGridPagination from "@/components/DataTable/DataGridPagination";

import { useDialogStore } from "@/store/useDialogStore";
import { Box } from "@mui/material";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { EllipsisHorizontalIcon } from "@/components/ui/heroicons-animated/ellipsis-horizontal";
import { dateFilter, textFilter } from "@/components/DataTable/DataGridFilters";

type TResponse = {
  count: number;
  dataset: {
    _id: string;
    client: string;
    createdAt: string;
    updatedAt: string;
  };
};

export default function Clients() {
  // const { isLoading } = useQuery(
  //   [
  //     apiUrl,
  //     paginationModel?.pageSize,
  //     paginationModel?.page,
  //     "display",
  //     encodeURI(JSON.stringify({ filterModel, sortModel })),
  //   ],
  //   ({ queryKey }) =>
  //     axios.get(
  //       `${queryKey[0]}?limit=${queryKey[1]}&offset=${queryKey[2]}&view=${queryKey[3]}&options=${queryKey[4]}&scope=users`
  //     ),
  //   {
  //     enabled: JSON.stringify({ filterModel, sortModel }) !== "{}",
  //     select: ({ data }) => data,
  //     onSuccess: (data) => setData(data),
  //   }
  // );

  // ? Refs
  const apiRef = useGridApiRef();

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
    columnsToHide: [
      "_id",
      "added.by",
      "added.on",
      "modified.by",
      "modified.on",
    ],
    columnsToSort: [{ field: "_id", sort: "desc" }],
    toPin: {
      left: [GRID_CHECKBOX_SELECTION_COL_DEF.field, "_id"],
      right: ["actions"],
    },
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
      axios<GridValidRowModel>(
        `${queryKey[0]}?limit=${queryKey[1]}&offset=${queryKey[2]}&view=${queryKey[3]}&options=${queryKey[4]}&scope=__DEFAULT__`,
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
        //columnVisibilityModel: initialState?.columns?.columnVisibilityModel,
        // columnVisibilityModel: {
        //   _id: false,
        // },
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
              maxWidth: 220,
              flex: 1,
            },
            {
              field: "client",
              headerName: "Client",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              editable: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              minWidth: 250,
              flex: 1,
              preProcessEditCellProps: (
                params: GridPreProcessEditCellProps,
              ) => ({
                ...params.props,
                error: !params.props.value || params.props.value.length > 50,
              }),
              //filterOperators: textFilter,
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
              renderCell: ({ row: { _id, client } }) => (
                <Button
                  isIconOnly
                  isLoading={false}
                  isDisabled={false}
                  radius="full"
                  className="flex flex-1 align-middle self-center align-center justify-center"
                  onPress={() => {
                    //changeRowSelection([_id]);
                    showConfirm({
                      operation: "delete",
                      status: "info",
                      subject: `Confirm deletion of ${client}`,
                      body: `Are you sure you intend to delete this client?`,
                    });
                  }}
                >
                  <DeleteIcon size={20} />
                </Button>
              ),
            },
            { field: "added.by", headerName: "Added By", hideable: false },
            {
              field: "added.on",
              headerName: "Added On",
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
          getRowId={({ _id }) => _id}
          getRowHeight={() => "auto"}
          //isRowSelectable={({ row: { isActive } }) => isActive}
          // autosizeOptions={{
          //   columns: ["_id", "client", "added", "modified"],
          //   includeOutliers: true,
          //   includeHeaders: true,
          //   expand: true,
          //   outliersFactor: 1.5,
          // }}
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
            //exclude: ["multiApprove", "multiReject"],
            exportURL: `${apiUrl}?scope=users&limit=${data?.count}&offset=${
              paginationModel?.page
            }&view=export&options=${encodeURI(
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
