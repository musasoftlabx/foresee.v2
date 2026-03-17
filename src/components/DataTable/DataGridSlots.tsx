"use client";

// * Next
import Image from "next/image";

// * MUI
import {
  GridApiPro,
  GridColumnVisibilityModel,
  GridFilterModel,
  GridRowSelectionModel,
  GridSlotProps,
} from "@mui/x-data-grid-pro";

// * Components
import DataGridToolbar from "./DataGridToolbar";

// * Icons
import { TbDragDrop } from "react-icons/tb";
import { Dispatch } from "react";

export type DataGridSlots = {
  apiRef: React.RefObject<GridApiPro | null>;
  /**
   * Extends the API URL defined to the toolbar
   */
  apiUrl: string;
  /**
   * Extends the API URL defined to the toolbar
   */
  title: string;
  /**
   * Description of the table.
   * @default 'Total row count, filtered count'
   */
  caption: string;
  /**
   * Effects the filter model to the table
   */
  changeFilters: (arg0: GridFilterModel) => void;
  /**
   * Effects the column visibility model to the table
   */
  changeVisibleColumns: (arg0: GridColumnVisibilityModel) => void;
  /**
   * Effects the row selection model to the table
   */
  changeRowSelection: (arg0: GridRowSelectionModel) => void;
  /**
   * Clears all filters
   */
  clearFilters: () => void;
  /**
   * Clears row selections
   */
  clearRowSelection: () => void;
  /**
   * Excludes the listed buttons from displaying on the toolbar
   */
  exclude: [
    _?: string, // Caters for undefined instances where filtering option is excluded on mobile to enable header filters.
    creations?: string,
    filters?: string,
    columns?: string,
    exports?: string,
    statcards?: string,
    approvals?: string,
    rejections?: string,
    deletions?: string,
  ];

  exportUrl?: string;

  extraActions?: React.ReactNode;
  /**
   * Handles data refetch by triggering refetch query
   */
  handleGetData: () => void;
  /**
   * How to label the new item button
   */
  newItemLabel: "Add" | "Create" | "New";
  /**
   * Parses the exporting state to the toolbar
   */
  isExporting: boolean;
  /**
   * Parses the loading state to the toolbar
   */
  isLoading: boolean;
  setIsExporting: (arg0: boolean) => void;
  /**
   * Fields included in the search criteria
   */
  searchPlaceholder?: string;
  setIsNewItemOpen: Dispatch<React.SetStateAction<boolean>>;
  stats?: boolean;
  changeStats?: (arg0: boolean) => void; //React.Dispatch<React.SetStateAction<boolean>>;
};

export const DataGridSlots = ({
  apiRef,
  apiUrl,
  title,
  caption,
  changeFilters,
  clearFilters,
  changeRowSelection,
  clearRowSelection,
  changeVisibleColumns,
  exclude,
  exportUrl,
  handleGetData,
  newItemLabel,
  isExporting,
  isLoading,
  setIsExporting,
  setIsNewItemOpen,
  searchPlaceholder,
  stats,
  changeStats,
  extraActions,
}: DataGridSlots) => ({
  noResultsOverlay: () => "",
  noRowsOverlay: () => (
    <section className="absolute --dark:bg-gray-950 z-[-1] h-[inherit] w-[inherit] top-0 right-0 bottom-0 left-0">
      <div className="flex flex-col h-[inherit] items-center justify-center -mt-5">
        <Image
          src="/images/animated/no-records.gif"
          alt="no-records"
          priority
          width={150}
          height={150}
        />
        <div className="font-bold text-xl -mt-5">No records found!</div>
        <div className="font-bold text-sm text-muted-foreground">
          We could not find any items under these
        </div>
      </div>
    </section>
  ),
  rowReorderIcon: () => (
    <TbDragDrop style={{ width: 21, height: 23, opacity: 0.8 }} />
  ),
  toolbar: () => (
    <DataGridToolbar
      apiRef={apiRef}
      apiUrl={apiUrl}
      title={title}
      caption={caption}
      changeFilters={changeFilters}
      clearFilters={clearFilters}
      changeRowSelection={changeRowSelection}
      clearRowSelection={clearRowSelection}
      changeVisibleColumns={changeVisibleColumns}
      exclude={exclude}
      exportUrl={exportUrl}
      handleGetData={handleGetData}
      newItemLabel={newItemLabel}
      isExporting={isExporting}
      isLoading={isLoading}
      setIsExporting={setIsExporting}
      setIsNewItemOpen={setIsNewItemOpen}
      searchPlaceholder={searchPlaceholder}
      extraActions={extraActions}
      stats={stats}
      changeStats={changeStats}
    />
  ),
});

export const DataGridSlotProps: Pick<GridSlotProps, "loadingOverlay"> = {
  loadingOverlay: { variant: "skeleton", noRowsVariant: "skeleton" },
};
