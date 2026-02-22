import { string } from "./../../../../dealer-portal/dealers/src/utils/yup";
// * React
import { RefObject, useCallback, useEffect, useState } from "react";

// * NPM
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// * MUI
import {
  GridApiPro,
  GridColumnVisibilityModel,
  GridFilterModel,
  GridInitialState,
  GridLogicOperator,
  GridPaginationModel,
  GridPinnedColumnFields,
  GridPinnedColumns,
  GridRowId,
  GridRowModel,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import { addToast } from "@heroui/react";
///models/gridStatePro
//mport { GridInitialStatePro } from "@mui/x-data-grid-pro/components/";

//import { GridColDef, GridStateColDef } from '@mui/x-data-grid-pro/models/colDef/gridColDef';
import { TbDatabaseEdit } from "react-icons/tb";

type TUpdateCell = {
  newRow: GridRowModel;
  oldRow: GridRowModel;
  url: string;
};

export default function useCustomDataGrid({
  apiRef,
  apiUrl,
  toPin,
  columnsToHide,
  columnsToSort,
}: {
  apiRef: RefObject<GridApiPro | null>;
  apiUrl: string;
  toPin: GridPinnedColumnFields;
  /**
   * This specifies the fields to hide from the datagrid view
   * @type {{ fieldA: boolean, fieldB: boolean, ... }}
   * @see http://172.29.127.133:3333
   * @author Musa Mutetwi Muliro <mmuliro@safaricom.co.ke>
   */
  columnsToHide: string[];
  columnsToSort?: GridSortModel;
}) {
  // ? Hooks
  const queryClient = useQueryClient();

  // ? States
  const [initialState, setInitialState] = useState<GridInitialState>();
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>();
  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>();
  const [pinnedColumnsModel, setPinnedColumnsModel] =
    useState<GridPinnedColumnFields>();
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>();
  const [sortModel, setSortModel] = useState<GridSortModel>();
  const [stats, setStats] = useState<boolean>();

  // ? Effects
  useEffect(() => {
    // TODO: Check localstorage and retrieve if found
    const filtered = localStorage.getItem(`_${apiUrl}_filtered_columns`);
    filtered && setFilterModel(JSON.parse(filtered));

    const pagination = localStorage.getItem(`_${apiUrl}_pagination`);
    pagination
      ? setPaginationModel(JSON.parse(pagination))
      : setPaginationModel({ pageSize: 20, page: 0 });

    const pinned = localStorage.getItem(`_${apiUrl}_pinned_columns`);
    pinned
      ? setPinnedColumnsModel(JSON.parse(pinned))
      : setPinnedColumnsModel(toPin);

    const selected = localStorage.getItem(`_${apiUrl}_selected_rows`);
    if (selected) {
      const stored = JSON.parse(selected);
      setRowSelectionModel({ ...stored, ids: new Set(stored.ids) });
    }

    const sorted = localStorage.getItem(`_${apiUrl}_sorted_columns`);
    sorted ? setSortModel(JSON.parse(sorted)) : setSortModel(columnsToSort);

    const state = localStorage.getItem(`_${apiUrl}_state`);
    state ? setInitialState(JSON.parse(state)) : setInitialState({});

    const visible = localStorage.getItem(`_${apiUrl}_visible_columns`);
    if (visible) setColumnVisibilityModel(JSON.parse(visible));
    else {
      const obj = {};
      columnsToHide.map((column: string) =>
        Object.assign(obj, { [column]: false }),
      );
      setColumnVisibilityModel(obj);
    }

    const stats = localStorage.getItem(`_${apiUrl}_stats`);
    stats ? setStats(JSON.parse(stats)) : setStats(true);
  }, []);

  // ? Functions
  const syncState = () => {
    setInitialState(apiRef.current?.exportState());
    localStorage.setItem(
      `_${apiUrl}_state`,
      JSON.stringify(apiRef.current?.exportState()),
    );
  };

  const changeRowSelection = (model: GridRowSelectionModel) => {
    setRowSelectionModel(model);
    localStorage.setItem(
      `_${apiUrl}_selected_rows`,
      JSON.stringify({ ...model, ids: [...model.ids] }),
    );
  };

  const clearRowSelection = () => {
    setRowSelectionModel({ type: "include", ids: new Set() });
    localStorage.removeItem(`_${apiUrl}_selected_rows`);
  };

  const changeVisibleColumns = (model: GridColumnVisibilityModel) => {
    setColumnVisibilityModel(model);
    localStorage.setItem(`_${apiUrl}_visible_columns`, JSON.stringify(model));
  };

  const changeFilters = (model: GridFilterModel) => {
    setFilterModel(model);
    localStorage.setItem(`_${apiUrl}_filtered_columns`, JSON.stringify(model));
  };

  const clearFilters = () => {
    setFilterModel({
      items: [],
      logicOperator: GridLogicOperator.And,
      quickFilterValues: [],
      quickFilterLogicOperator: GridLogicOperator.And,
    });
    localStorage.removeItem(`_${apiUrl}_filtered_columns`);
  };

  const changePagination = (model: GridPaginationModel) => {
    localStorage.removeItem(`____${apiUrl}_pagination`);
    localStorage.removeItem(`__${apiUrl}_pagination`);
    localStorage.removeItem(`___${apiUrl}_pagination`);
    setPaginationModel(model);
    localStorage.setItem(`_${apiUrl}_pagination`, JSON.stringify(model));
  };

  const changePinnedColumns = (model: GridPinnedColumnFields) => {
    setPinnedColumnsModel(model);
    localStorage.setItem(`_${apiUrl}_pinned_columns`, JSON.stringify(model));
  };

  const changeSorting = (model: GridSortModel) => {
    setSortModel(model);
    localStorage.setItem(`_${apiUrl}_sorted_columns`, JSON.stringify(model));
  };

  const changeStats = (show: boolean) => {
    setStats(show);
    localStorage.setItem(`_${apiUrl}_stats`, JSON.stringify(show));
  };

  // ? Constants
  const filters =
    filterModel?.items?.length! > 0 ||
    filterModel?.quickFilterValues?.length! > 0;

  // ? Functions
  const handleGetData = () => {
    queryClient.refetchQueries({
      queryKey: [
        apiUrl,
        paginationModel?.pageSize,
        paginationModel?.page,
        "display",
        encodeURI(JSON.stringify({ filterModel, sortModel })),
      ],
    });
  };

  const updateCell = ({ newRow, oldRow, url }: TUpdateCell) => {
    const _id = newRow._id;
    let field, value;

    Object.values(newRow).forEach((val, i) => {
      if (val !== Object.values(oldRow)[i]) {
        field = Object.keys(newRow).find((key) => newRow[key] === val);
        value = val;
      }
    });

    if (field !== undefined && value !== undefined)
      updateData(
        { _id, field, value, url },
        {
          onSuccess: () =>
            addToast({
              title: "Success",
              description: "Update successful!",
              color: "success",
              variant: "flat",
              //icon: <TbDatabaseEdit />,
              timeout: 3000,
            }),
          onError: () =>
            addToast({
              title: "Error",
              description: "Update was not successful!",
              color: "danger",
              variant: "flat",
              //icon: <TbDatabaseEdit/>,
              timeout: 3000,
            }),
        },
      );

    return newRow;
  };

  // ? Mutations
  const { mutate: updateData } = useMutation({
    mutationFn: ({
      _id,
      field,
      value,
      url,
    }: {
      _id: GridRowId;
      field?: string;
      value?: string | number | boolean;
      url: string;
    }) => axios.patch(url, { _id, field, value }),
  });

  return {
    initialState,
    setInitialState,
    columnVisibilityModel,
    setColumnVisibilityModel,
    filters,
    filterModel,
    setFilterModel,
    paginationModel,
    setPaginationModel,
    pinnedColumnsModel,
    setPinnedColumnsModel,
    rowSelectionModel,
    setRowSelectionModel,
    clearRowSelection,
    sortModel,
    setSortModel,
    stats,
    syncState,
    changeFilters,
    clearFilters,
    changePagination,
    changePinnedColumns,
    changeRowSelection,
    changeSorting,
    changeVisibleColumns,
    changeStats,
    handleGetData,
    updateCell,
    updateData,
  };
}
