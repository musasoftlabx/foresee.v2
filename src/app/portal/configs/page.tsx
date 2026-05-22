"use client";

// * React
// biome-ignore assist/source/organizeImports: <biome-ignore lint: false positive>
import { useEffect, useState } from "react";

// * NPM
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

// * HUI
import { addToast } from "@heroui/react";

// * SUI
import { Button } from "@/components/ui/shadcn/button";

// * MUI
import { capitalize } from "@mui/material";
import {
  type GridPreProcessEditCellProps,
  type GridRowModel,
  DataGridPro,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridValidRowModel,
  useGridApiRef,
} from "@mui/x-data-grid-pro";

// * Icons
import { BanIcon, SaveIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { DeleteIcon } from "@/components/ui/lucide-animated/delete";

// * Components
import {
  DataGridSlotProps,
  DataGridSlots,
} from "@/components/DataTable/DataGridSlots";
import AddClient from "@/components/modals/add-client";

// * Hooks
import useCustomDataGrid from "@/hooks/useCustomDataGrid";

// * Store
import { useConfirmDialogStore } from "@/store/useConfirmDialogStore";
import { FilePenLineIcon } from "@/components/ui/lucide-animated/file-pen-line";

const permissions = {
  readWriteRoles: [""],
};

export default function Configs({ apiUrl = "configs" }) {
  // ? States
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [count, setCount] = useState<number>(0);
  const [rows, setRows] = useState<
    {
      id: number;
      environment: string;
      service: string;
      key: string;
      value: string;
      isNew: boolean;
    }[]
  >();

  // ? Hooks
  const apiRef = useGridApiRef();
  const confirm = useConfirmDialogStore((state) => state.confirm);
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
    columnsToHide: ["id"],
    columnsToSort: [{ field: "id", sort: "desc" }],
    toPin: { left: ["id"], right: ["actions"] },
  });

  // ? Queries
  const { data, isLoading } = useQuery({
    queryKey: [
      apiUrl,
      paginationModel?.pageSize,
      paginationModel?.page,
      encodeURI(JSON.stringify({ filterModel, sortModel })),
    ],
    queryFn: ({ queryKey }) => axios(`${queryKey[0]}`),
    select: ({ data }) => data,
    enabled: JSON.stringify({ filterModel, sortModel }) !== "{}",
  });

  // ? Mutations
  const { mutate: updateData } = useMutation({
    mutationFn: ({
      service,
      environment,
      key,
      value,
    }: {
      service: string;
      environment: string;
      key: string;
      value: string;
    }) => axios.patch(apiUrl, { service, environment, key, value }),
  });

  const { mutate: deleteConfigItem } = useMutation({
    mutationFn: (body: { attributes: string }) =>
      axios.delete(apiUrl, { data: body }),
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

  useEffect(() => {
    if (data) {
      setRows(data.dataset);
      setCount(data.totalCount);
    }
  }, [data]);

  return (
    <div className="h-[calc(100vh-35px)]">
      <AddClient isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      <DataGridPro
        apiRef={apiRef}
        rows={rows ?? []}
        rowCount={count ?? 0}
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
            type: "singleSelect",
            field: "environment",
            headerName: "Environment",
            editable: true,
            filterable: false,
            hideable: true,
            pinnable: false,
            resizable: false,
            valueOptions: ["development", "production"],
            minWidth: 90,
            flex: 1,
          },
          {
            field: "service",
            headerName: "Service",
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
            valueParser: (value) => value.toUpperCase(),
          },
          {
            field: "key",
            headerName: "Key",
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
            valueParser: (value) => value.toUpperCase(),
          },
          {
            field: "value",
            headerName: "Value",
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
            type: "actions",
            field: "actions",
            headerName: "Delete",
            headerAlign: "center",
            align: "center",
            sortable: false,
            filterable: false,
            hideable: false,
            pinnable: false,
            disableColumnMenu: true,
            width: 100,
            getActions: ({
              row: { id, environment, service, key },
            }: {
              row: GridRowModel;
            }) => {
              const isInEditMode =
                rowModesModel[id]?.mode === GridRowModes.Edit;

              if (isInEditMode) {
                return [
                  <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    onClick={() => {
                      setRowModesModel({
                        ...rowModesModel,
                        [id]: { mode: GridRowModes.View },
                      });
                    }}
                  />,
                  <GridActionsCellItem
                    icon={<BanIcon />}
                    label="Cancel"
                    onClick={() => {
                      setRowModesModel({
                        ...rowModesModel,
                        [id]: {
                          mode: GridRowModes.View,
                          ignoreModifications: true,
                        },
                      });

                      const editedRow = rows?.find(
                        (row: { id: number }) => row.id === id,
                      );

                      if (editedRow!.isNew) {
                        setRows(
                          rows?.filter((row: { id: number }) => row.id !== id),
                        );
                      }
                    }}
                  />,
                ];
              }

              return [
                <div className="flex items-center justify-center gap-3 mt-0.5">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      if (typeof id === "string")
                        setRows(
                          rows?.filter(
                            (row: { id: GridRowId }) => row.id !== id,
                          ),
                        );
                      else
                        deleteConfigItem(
                          { attributes: `${environment}:${service}:${key}` },
                          {
                            onSuccess: () => {
                              addToast({
                                title: "Success",
                                description:
                                  "Config item deleted successfully!",
                                color: "success",
                                variant: "flat",
                                timeout: 3000,
                              });

                              handleGetData();
                            },
                            onError: () =>
                              addToast({
                                title: "Error",
                                description: "Error deleting config item",
                                color: "danger",
                                variant: "flat",
                                timeout: 3000,
                              }),
                          },
                        );
                    }}
                  >
                    <FilePenLineIcon />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => {
                      if (typeof id === "string")
                        setRows(
                          rows?.filter(
                            (row: { id: GridRowId }) => row.id !== id,
                          ),
                        );
                      else
                        deleteConfigItem(
                          { attributes: `${environment}:${service}:${key}` },
                          {
                            onSuccess: () => {
                              addToast({
                                title: "Success",
                                description:
                                  "Config item deleted successfully!",
                                color: "success",
                                variant: "flat",
                                timeout: 3000,
                              });

                              handleGetData();
                            },
                            onError: () =>
                              addToast({
                                title: "Error",
                                description: "Error deleting config item",
                                color: "danger",
                                variant: "flat",
                                timeout: 3000,
                              }),
                          },
                        );
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </div>,
              ];

              return [
                <GridActionsCellItem
                  icon={<SquarePenIcon className="text-orange-500" size={20} />}
                  // disabled={
                  //   !permissions?.readWriteRoles?.includes(profile?.role) &&
                  //   !permissions?.readWriteUsers?.includes(profile?.username)
                  // }
                  label="Edit"
                  onClick={() =>
                    setRowModesModel({
                      ...rowModesModel,
                      [id]: { mode: GridRowModes.Edit },
                    })
                  }
                />,
                <GridActionsCellItem
                  icon={<Trash2Icon className="text-red-500" size={20} />}
                  // disabled={
                  //   !permissions?.readWriteRoles?.includes(profile?.role) &&
                  //   !permissions?.readWriteUsers?.includes(profile?.username)
                  // }
                  label="Delete"
                  onClick={() => {
                    if (typeof id === "string")
                      setRows(
                        rows?.filter((row: { id: GridRowId }) => row.id !== id),
                      );
                    else
                      deleteConfigItem(
                        { attributes: `${environment}:${service}:${key}` },
                        {
                          onSuccess: () => {
                            addToast({
                              title: "Success",
                              description: "Config item deleted successfully!",
                              color: "success",
                              variant: "flat",
                              timeout: 3000,
                            });

                            handleGetData();
                          },
                          onError: () =>
                            addToast({
                              title: "Error",
                              description: "Error deleting config item",
                              color: "danger",
                              variant: "flat",
                              timeout: 3000,
                            }),
                        },
                      );
                  }}
                />,
              ];
            },
          },
        ]}
        getRowHeight={() => 40}
        density="compact"
        editMode="row"
        pagination
        showToolbar
        hideFooterPagination
        hideFooterSelectedRowCount
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
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newRowModesModel) =>
          setRowModesModel(newRowModesModel)
        }
        onRowEditStop={(params, event) => {
          if (params.reason === GridRowEditStopReasons.rowFocusOut)
            event.defaultMuiPrevented = true;
        }}
        onColumnOrderChange={syncState}
        onColumnResize={syncState}
        processRowUpdate={(newRow: GridRowModel, oldRow: GridRowModel) => {
          const { _service, _environment, _key, _value } = oldRow;
          const { service, environment, key, value } = newRow;

          if (service && environment && key && value)
            if (
              service !== _service &&
              environment !== _environment &&
              key !== _key &&
              value !== _value
            )
              updateData(
                { service, environment, key, value },
                {
                  onSuccess: () => {
                    addToast({
                      title: "Success",
                      description: "Update successful!",
                      color: "success",
                      variant: "flat",
                      timeout: 3000,
                    });
                    handleGetData();
                    setRowModesModel({});
                  },
                  onError: () =>
                    addToast({
                      title: "Error",
                      description: "Update was not successful!",
                      color: "danger",
                      variant: "flat",
                      timeout: 3000,
                    }),
                },
              );

          return newRow;
        }}
        slots={DataGridSlots({
          apiRef,
          apiUrl: `${apiUrl}?scope=users`,
          title: capitalize(apiUrl),
          caption: `${data?.filtered} items displayed from a total of ${data?.totalCount}.`,
          changeFilters,
          changeVisibleColumns,
          changeRowSelection,
          changePagination,
          clearFilters,
          clearRowSelection,
          totalServerCount: data?.totalCount,
          paginationModel,
          exclude: ["creations"],
          exportUrl: `${apiUrl}?scope=users&limit=${data?.filtered}&offset=${
            paginationModel?.page
          }&exportable=true&refines=${encodeURI(
            JSON.stringify({ filterModel, sortModel }),
          )}`,
          handleGetData,
          isExporting,
          isLoading,
          searchPlaceholder: "Name",
          setIsExporting,
          stats,
          changeStats,
          setIsModalOpen,
          extraActions: [
            <Button
              color="primary"
              onClick={() => {
                const id = "_new_".concat(
                  Math.round(Math.random() * 1000).toString(),
                );

                setRows((oldModel: GridValidRowModel[]) => {
                  return [
                    {
                      id,
                      environment: "",
                      service: "",
                      key: "",
                      value: "",
                    },
                    ...oldModel,
                  ];
                });

                setRowModesModel((oldModel: GridRowModel) => {
                  return {
                    ...oldModel,
                    [id]: {
                      mode: GridRowModes.Edit,
                      fieldToFocus: "environment",
                    },
                  };
                });
              }}
            >
              Add Config Item
            </Button>,
          ],
        })}
        slotProps={DataGridSlotProps}
        sx={(theme) => DataGridSlots({}).styles(theme)}
      />
    </div>
  );
}
