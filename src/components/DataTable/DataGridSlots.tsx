"use client";

// * MUI
import {
  GridApiPro,
  GridColumnVisibilityModel,
  GridFilterModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid-pro";
import { green, red } from "@mui/material/colors";

// * Components
import DataGridToolbar from "./DataGridToolbar";
import DataGridLoadingOverlay from "./DataGridLoadingOverlay";
import DataGridNoRowsOverlay from "./DataGridNoRowsOverlay";

// * Icons
import { CgPlayListAdd } from "react-icons/cg";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbDragDrop } from "react-icons/tb";
import { Dispatch } from "react";

export type tDataGridSlots = {
  apiRef: React.RefObject<GridApiPro | null>;
  apiUrl: string;
  changeFilters: (arg0: GridFilterModel) => void;
  changeVisibleColumns: (arg0: GridColumnVisibilityModel) => void;
  clearFilters: () => void;
  changeRowSelection: (arg0: GridRowSelectionModel) => void;
  clearRowSelection: () => void;
  /**
   * This will exclude the listed buttons from displaying.
   *
   * @see https://musasoftlabx.com
   */
  exclude?: [
    _?: string, // Caters for undefined instances where filtering option is excluded on mobile to enable header filters.
    add?: string,
    columns?: string,
    exporting?: string,
    filtering?: string,
    toggleStats?: string,
    multiApprove?: string,
    multiReject?: string,
    multiDelete?: string,
    deselectAll?: string,
  ];
  exportURL?: string;
  extraActions?: React.ReactNode;
  handleGetData: () => void;
  isExporting: boolean;
  isLoading: boolean;
  setIsExporting: (arg0: boolean) => void;
  search?: { fields: string; width?: number };
  setIsAddItemOpen: Dispatch<React.SetStateAction<boolean>>;
  stats?: boolean;
  changeStats?: (arg0: boolean) => void; //React.Dispatch<React.SetStateAction<boolean>>;
};

export const DataGridSlots = ({
  apiRef,
  apiUrl,
  changeFilters,
  clearFilters,
  changeRowSelection,
  clearRowSelection,
  changeVisibleColumns,
  exclude,
  exportURL,
  handleGetData,
  isExporting,
  isLoading,
  setIsExporting,
  setIsAddItemOpen,
  search,
  stats,
  changeStats,
  extraActions,
}: tDataGridSlots) => ({
  FilterPanel: <div />,
  filterPanelAddIcon: () => <CgPlayListAdd style={{ color: green[400] }} />,
  filterPanelRemoveAllIcon: () => (
    <RiDeleteBinLine style={{ color: red[300] }} />
  ),
  filterPanelDeleteIcon: () => (
    <RiDeleteBinLine size={24} style={{ color: red[300] }} />
  ),
  //loadingOverlay: () => <DataGridLoadingOverlay />,
  noResultsOverlay: () => <DataGridNoRowsOverlay />,
  noRowsOverlay: () => <DataGridNoRowsOverlay />,
  rowReorderIcon: () => (
    <TbDragDrop style={{ width: 21, height: 23, opacity: 0.8 }} />
  ),
  toolbar: () => (
    <DataGridToolbar
      apiRef={apiRef}
      apiUrl={apiUrl}
      changeFilters={changeFilters}
      clearFilters={clearFilters}
      changeRowSelection={changeRowSelection}
      clearRowSelection={clearRowSelection}
      changeVisibleColumns={changeVisibleColumns}
      exclude={exclude}
      exportURL={exportURL}
      handleGetData={handleGetData}
      isExporting={isExporting}
      isLoading={isLoading}
      setIsExporting={setIsExporting}
      setIsAddItemOpen={setIsAddItemOpen}
      search={search}
      extraActions={extraActions}
      stats={stats}
      changeStats={changeStats}
    />
  ),
});

export const DataGridSlotProps = {
  toolbar: { showQuickFilter: true },
  filterPanel: {
    filterFormProps: {
      logicOperatorInputProps: {
        variant: "outlined",
        size: "small",
      },
      columnInputProps: {
        variant: "outlined",
        size: "small",
        sx: { mt: "auto" },
      },
      operatorInputProps: {
        variant: "outlined",
        size: "small",
        sx: { mt: "auto" },
      },
      valueInputProps: {
        InputComponentProps: {
          variant: "outlined",
          size: "small",
        },
      },
    },
    sx: {
      pr: 2,
      "& .MuiDataGrid-filterForm": { p: 2 },
      // "& .MuiDataGrid-filterForm:nth-of-type(even)": {
      //   backgroundColor: (theme: { palette: { mode: string } }) =>
      //     theme.palette.mode === "dark" ? "#444" : "#f5f5f5",
      // },
      "& .MuiDataGrid-filterFormLogicOperatorInput": { mr: 2 },
      "& .MuiDataGrid-filterFormColumnInput": { mr: 2, width: 150 },
      "& .MuiDataGrid-filterFormOperatorInput": { mr: 2 },
      "& .MuiDataGrid-filterFormValueInput": { width: 200 },
      "& .MuiDataGrid-panelFooter >": {
        ":first-of-type": {
          color: "--primary", //green[500],
          ml: 2,
          textTransform: "capitalize",
        },
        ":last-child": {
          color: red[300],
          textTransform: "capitalize",
        },
      },
    },
  },
  loadingOverlay: { variant: "skeleton", noRowsVariant: "skeleton" },
};
