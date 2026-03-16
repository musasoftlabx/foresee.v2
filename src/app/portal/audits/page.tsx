"use client";

import Portal from "../layout";

// * React
import { Fragment, useEffect, useState } from "react";

import Link from "next/link";

// * NPM
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

// * HUI
import {
  Avatar,
  Badge,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";

// * SUI
import { Button } from "@/components/ui/shadcn/button";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/shadcn/sheet";

// * RUI

import CreateStore from "@/components/admin/clients/create-store";

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
const apiUrl = "stores";

// * Hooks
import useCustomDataGrid from "@/hooks/useCustomDataGrid";

import { DataGridStyles } from "@/components/DataTable/DataGridStyles";
import DataGridPagination from "@/components/DataTable/DataGridPagination";

import { useDialogStore } from "@/store/useDialogStore";
import { EllipsisHorizontalIcon } from "@/components/ui/heroicons-animated/ellipsis-horizontal";
import { dateFilter } from "@/components/DataTable/DataGridFilters";
import React from "react";
import Stack from "@mui/material/Stack";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  ExternalLink,
  ExternalLinkIcon,
  FileSymlinkIcon,
  PackageIcon,
  Table2,
} from "lucide-react";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { BoxesIcon } from "@/components/ui/lucide-animated/boxes";
import { Separator } from "@/components/ui/shadcn/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import { useRouter } from "next/navigation";

type TResponse = {
  count: number;
  dataset: {
    id: string;
    client: string;
    createdAt: string;
    updatedAt: string;
  };
};

export default function Stores() {
  // ? Refs
  const apiRef = useGridApiRef();
  const router = useRouter();

  const showConfirm = useDialogStore((state) => state.confirm);

  // ? States
  const [isExporting, setIsExporting] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [audits, setAudits] = useState([]);
  const [isAuditsSheetOpen, setIsAuditsSheetOpen] = useState(false);
  const [rowDetails, setRowDetails] = useState<GridValidRowModel>();
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
        `${queryKey[0]}?limit=${queryKey[1]}&offset=${queryKey[2]}&refines=${queryKey[3]}`,
      ),
    select: ({ data }) => data,
    enabled: JSON.stringify({ filterModel, sortModel }) !== "{}",
  });

  const { mutate: getAudits, isSuccess } = useMutation({
    mutationFn: (id: string) => axios(`/audits?store=${id}`),
    onSuccess: ({ data }) => {
      setAudits(data);
    },
    onError: () => {},
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
      <CreateStore
        isAddItemOpen={isAddItemOpen}
        setIsAddItemOpen={setIsAddItemOpen}
      />

      <div className="flex items-center justify-center">
        {/* <Sheet open={isAuditsSheetOpen} onOpenChange={setIsAuditsSheetOpen}>
          <SheetContent className="flex flex-col gap-0 space-y-0">
            <SheetHeader>
              <SheetTitle>{rowDetails?.name}</SheetTitle>
              <SheetDescription>
                Audits done under {rowDetails?.name} for {rowDetails?.client}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-230px)] flex-1 grow">
              <div className="w-full">
                <Table className="border-x-0 border-y-1 border-dashed">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audit</TableHead>
                      <TableHead>Locations</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead>Scans</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rowDetails?.audits.map(
                      ({
                        id,
                        date,
                        locationsCount,
                        inventoryCount,
                        scansCount,
                      }: {
                        id: string;
                        date: string;
                        locationsCount: number;
                        inventoryCount: number;
                        scansCount: number;
                      }) => (
                        <TableRow key={id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="bg-muted rounded-md flex size-9 shrink-0 items-center justify-center">
                                <PackageIcon className="text-muted-foreground size-4" />
                              </div>
                              <div className="flex flex-col">
                                {`Audit ${dayjs(date).format("DD/MM/YY")}`}
                                <div className="flex gap-3">
                                  <Link
                                    href={`/portal/locations/${id}`}
                                    className="text-sm text-muted-foreground font-medium hover:underline cursor-pointer"
                                  >
                                    Locations
                                  </Link>
                                  <span>/</span>
                                  <Link
                                    href={`/portal/inventory/${id}`}
                                    className="text-sm text-muted-foreground font-medium hover:underline cursor-pointer"
                                  >
                                    Inventory
                                  </Link>
                                  <span>/</span>
                                  <Link
                                    href={`/portal/scans/${id}`}
                                    className="text-sm text-muted-foreground font-medium hover:underline cursor-pointer"
                                  >
                                    Scans
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center text-muted-foreground text-sm">
                              {locationsCount}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center text-muted-foreground text-sm">
                              {inventoryCount}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center text-muted-foreground text-sm">
                              {scansCount}
                            </div>
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet> */}

        <Drawer
          isOpen={isAuditsSheetOpen}
          onOpenChange={setIsAuditsSheetOpen}
          backdrop="blur"
          size="xl"
        >
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="flex flex-col gap-1">
                  <h4>{rowDetails?.name}</h4>
                  <h6 className="text-sm text-foreground-500">
                    Audits done under {rowDetails?.name} for{" "}
                    {rowDetails?.client}
                  </h6>
                </DrawerHeader>
                <DrawerBody>
                  <ScrollArea className="h-[calc(100vh-230px)] flex-1 grow">
                    <div className="w-full">
                      {/* <Table className="border-x-0 border-y-1 border-dashed">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Audit</TableHead>
                            <TableHead>Locations</TableHead>
                            <TableHead>Scans</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rowDetails?.audits.map(
                            ({
                              id,
                              date,
                              locationsCount,
                              inventoryCount,
                              scansCount,
                            }: {
                              id: string;
                              date: string;
                              locationsCount: number;
                              inventoryCount: number;
                              scansCount: number;
                            }) => (
                              <TableRow key={id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="bg-muted rounded-md flex size-9 shrink-0 items-center justify-center">
                                      <PackageIcon className="text-muted-foreground size-4" />
                                    </div>
                                    <div className="flex flex-col">
                                      {`Audit ${dayjs(date).format("DD/MM/YY")}`}
                                      <div className="flex gap-3">
                                        <Link
                                          href={`/portal/locations/${id}`}
                                          className="text-sm text-muted-foreground font-medium hover:underline cursor-pointer"
                                        >
                                          Locations
                                        </Link>
                                        <span>/</span>
                                        <Link
                                          href={`/portal/scans/${id}`}
                                          className="text-sm text-muted-foreground font-medium hover:underline cursor-pointer"
                                        >
                                          Scans
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-center text-muted-foreground text-sm">
                                    {locationsCount}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-center text-muted-foreground text-sm">
                                    {inventoryCount}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-center text-muted-foreground text-sm">
                                    {scansCount}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                        </TableBody>
                      </Table> */}
                    </div>
                  </ScrollArea>
                </DrawerBody>
                <DrawerFooter>
                  {/* <Button
                    color="danger"
                    variant="light"
                    onPress={() => setIsAuditsSheetOpen(false)}
                  >
                    Close
                  </Button> */}
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </div>

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
              minWidth: 75,
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
              resizable: false,
              minWidth: 250,
              flex: 1,
              preProcessEditCellProps: (
                params: GridPreProcessEditCellProps,
              ) => ({
                ...params.props,
                error: !params.props.value || params.props.value.length > 50,
              }),
            },
            {
              field: "country",
              headerName: "Country",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              minWidth: 150,
              flex: 1,
              preProcessEditCellProps: (
                params: GridPreProcessEditCellProps,
              ) => ({
                ...params.props,
                error: !params.props.value || params.props.value.length > 50,
              }),
            },
            {
              field: "client",
              headerName: "Client",
              cellClassName: "vertical-center-cell",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              minWidth: 150,
              flex: 1,
              preProcessEditCellProps: (
                params: GridPreProcessEditCellProps,
              ) => ({
                ...params.props,
                error: !params.props.value || params.props.value.length > 50,
              }),
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
              minWidth: 120,
              flex: 1,
              renderCell: ({ row: { id, inventoryCount } }) => (
                <Button
                  variant="link"
                  onClick={() => router.push(`/portal/inventory/${id}`)}
                >
                  <span className="flex gap-1 underline decoration-dashed">
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
              headerName: "Actions",
              headerAlign: "center",
              align: "center",
              sortable: false,
              filterable: false,
              hideable: false,
              pinnable: false,
              disableColumnMenu: true,
              width: 100,
              renderCell: ({ row }) => (
                <div className="flex items-center justify-center gap-3 mt-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="default"
                        onClick={() => {
                          setRowDetails(row);
                          getAudits(row.id);
                          setIsAuditsSheetOpen(true);
                        }}
                      >
                        <FileSymlinkIcon aria-hidden="true" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">View Audits</TooltipContent>
                  </Tooltip>

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
          ]}
          //getDetailPanelHeight={() => "auto"}
          //getDetailPanelContent={getDetailPanelContent}
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
