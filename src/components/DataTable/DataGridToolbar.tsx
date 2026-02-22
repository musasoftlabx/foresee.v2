"use client";

import { BiReset } from "react-icons/bi";
// * React
import {
  ChangeEvent,
  Fragment,
  ReactHTMLElement,
  SetStateAction,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

// * NPM
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash/debounce";
import startCase from "lodash/startCase";
import lowerCase from "lodash/lowerCase";

// * HUI
import {
  Avatar,
  Badge,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@heroui/react";

// * MUI
import { green, grey, red } from "@mui/material/colors";
import {
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  gridColumnDefinitionsSelector,
  gridColumnFieldsSelector,
  gridColumnsStateSelector,
  GridColumnVisibilityModel,
  gridColumnVisibilityModelSelector,
  gridFilterActiveItemsSelector,
  GridFilterForm,
  GridFilterItem,
  gridFilterModelSelector,
  GridFilterPanel,
  GridLogicOperator,
  gridRowIdSelector,
  gridRowSelectionCountSelector,
  gridRowSelectionIdsSelector,
  GridRowSelectionModel,
  gridRowSelector,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  QuickFilterTrigger,
  Toolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid-pro";
//import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { Grid } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// * Components
import { tDataGridSlots } from "./DataGridSlots";
import { TextFieldX } from "../InputFields/TextFieldX";
//import Confirm from "@/components/Shared/Confirm";

// * Store
import { useAlertStore } from "@/store/useAlertStore";
import { useDialogStore } from "@/store/useDialogStore";
//import { useSnackBarStore } from "@/store/useToastStore";

// * Icons
import {
  BiCheckDouble,
  BiExport,
  BiFilter,
  BiSearchAlt2,
} from "react-icons/bi";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { MdAdd, MdSearch } from "react-icons/md";
import { MdDeselect } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { SlRefresh } from "react-icons/sl";
import Confirm from "../Dialogs/Confirm_";
import { ThemeOptions } from "@mui/material";
import { addToast } from "@heroui/react";
import { TbDatabaseEdit } from "react-icons/tb";
import { GoTrash } from "react-icons/go";
import {
  BanIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  CircleIcon,
  ClockIcon,
  FileTextIcon,
  FunnelXIcon,
  GlobeIcon,
  LayersIcon,
  LoaderIcon,
  PencilIcon,
  Plus,
  SearchIcon,
  SquareCheckBig,
  StarIcon,
  TerminalIcon,
  UploadIcon,
} from "lucide-react";

import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "../ui/shadcn/button-group";
import { Button } from "../ui/shadcn/button";
import { PlusIcon } from "../ui/lucide-animated/plus";
import { RefreshCWIcon } from "../ui/lucide-animated/refresh-cw";
import { SlidersHorizontalIcon } from "../ui/lucide-animated/sliders-horizontal";
import { GalleryHorizontalEndIcon } from "../ui/lucide-animated/gallery-horizontal-end";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/shadcn/dropdown-menu";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "../ui/shadcn/combobox";
import { HardDriveDownloadIcon } from "../ui/lucide-animated/hard-drive-download";
import {
  BsFileEarmarkPdf,
  BsFileEarmarkPdfFill,
  BsFiletypeCsv,
  BsFiletypePdf,
  BsFiletypeXlsx,
} from "react-icons/bs";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/shadcn/select";
import { CogIcon } from "../ui/lucide-animated/cog";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "../ui/reui/number-field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/shadcn/input-group";
import { Separator } from "../ui/shadcn/separator";
import { ScrollArea, ScrollBar } from "../ui/shadcn/scroll-area";
import { SquareStackIcon } from "../ui/lucide-animated/square-stack";
import { XIcon } from "../ui/lucide-animated/x";

import {
  Filters,
  type Filter,
  type FilterFieldConfig,
} from "@/components/ui/reui/filters";
import { z } from "zod";
import {
  AtSignIcon,
  CreditCardIcon,
  LinkIcon,
  ListFilterIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/shadcn/input";
import { Field, FieldLabel } from "../ui/shadcn/field";
import { Kbd } from "../ui/shadcn/kbd";
import {
  DateSelector,
  DateSelectorValue,
  formatDateValue,
} from "../ui/reui/date-selector";

import {
  Popover as ShadPopover,
  PopoverContent as ShadPopoverContent,
  PopoverTrigger as ShadPopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { Checkbox } from "../ui/shadcn/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/shadcn/tooltip";
import { EllipsisHorizontalIcon } from "../ui/heroicons-animated/ellipsis-horizontal";
import { EllipsisVerticalIcon } from "../ui/heroicons-animated/ellipsis-vertical";

// Zod validation helper - wraps a Zod schema to return validation result with message
function zodValidator<T extends z.ZodType>(schema: T) {
  return (value: unknown): { valid: boolean; message?: string } => {
    const result = schema.safeParse(value);
    if (result.success) {
      return { valid: true };
    }
    // Get the first error message from Zod using format()
    const formatted = result.error.format();
    const message =
      formatted._errors?.[0] || result.error.message || "Invalid value";
    return { valid: false, message };
  };
}
// Define Zod schemas for different field types
const emailSchema = z
  .string()
  .min(1, { message: "Email is required" })
  .pipe(z.email({ message: "Please enter a valid email address" }));
const urlSchema = z
  .string()
  .pipe(
    z.url({ message: "Please enter a valid URL (e.g., https://example.com)" }),
  );
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, {
  message: "Please enter a valid phone number",
});
const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(20, { message: "Username must be at most 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  });
const creditCardSchema = z.string().regex(/^\d{13,19}$/, {
  message: "Please enter a valid credit card number (13-19 digits)",
});

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "todo":
      return <ClockIcon className="text-primary" />;
    case "in-progress":
      return <CircleAlertIcon className="text-yellow-500" />;
    case "done":
      return <CircleCheckIcon className="text-green-500" />;
    case "cancelled":
      return <BanIcon className="text-destructive" />;
    default:
      return <CircleIcon className="text-muted-foreground" />;
  }
};
// Priority icon component
const PriorityIcon = ({ priority }: { priority: string }) => {
  const colors = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-orange-500",
    urgent: "text-red-500",
  };
  return <StarIcon className="colors[priority as keyof typeof colors]" />;
};

export const createFilter = (
  field: string,
  operator?: string,
  values: any,
) => ({
  id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
  field,
  operator: operator || "contains",
  values,
});

const operators = [
  { type: "text", value: "contains" },
  { type: "text", value: "doesNotContain" },
  { type: "text", value: "startsWith" },
  { type: "text", value: "endsWith" },
  { type: "divider" },
  { type: "text", value: "isEqualsTo" },
  { type: "text", value: "isNotEqualsTo" },
  { type: "numeric", value: "isGreaterThan" },
  { type: "numeric", value: "isGreaterThanOrEqualsTo" },
  { type: "numeric", value: "isLessThan" },
  { type: "numeric", value: "isLessThanOrEqualsTo" },
  { type: "range", value: "isBetween" },
  { type: "range", value: "isNotBetween" },
  { type: "divider" },
  { type: "date", value: "date" },
  { type: "divider" },
  { type: null, value: "isEmpty" },
  { type: null, value: "isNotEmpty" },
  { type: null, value: "isNull" },
  { type: null, value: "isNotNull" },
  { type: "divider" },
  { type: "list", value: "isAmong" },
  { type: "list", value: "isNotAmong" },
  { type: "csv", value: "isInList" },
];

export default function DataGridToolbar({
  //apiRef,
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
}: tDataGridSlots) {
  // ? Hooks
  const confirmOperation = useDialogStore((state) => state.operation);
  const showAlert = useAlertStore((state) => state.alert);
  const showConfirm = useDialogStore((state) => state.confirm);
  const closeConfirm = useDialogStore((state) => state.close);

  // ? States
  const [multiRejectAnchorEl, setMultiRejectAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [multiRejectionReason, setMultiRejectionReason] = useState<string>();

  // ? Mutations
  const { mutate: deleteData } = useMutation({
    mutationFn: (body: GridRowSelectionModel) =>
      axios.delete(`${apiUrl}`, { data: body }),
  });

  const { mutate: resetPassword } = useMutation({
    mutationFn: (body: GridRowSelectionModel) => axios.put(apiUrl, body),
  });

  const { mutate: multiAction } = useMutation({
    mutationFn: (body: {
      action: string;
      ids: GridRowSelectionModel;
      feedback?: string;
    }) => axios.put(apiUrl, body),
  });

  const apiRef = useGridApiContext();
  // ? Constants
  //const filters = apiRef.current?.state.filter.filterModel.items;
  //const rowSelection = apiRef.current?.state.rowSelection;

  const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
  const rowSelections = [...gridRowSelectionIdsSelector(apiRef)].map(
    (row) => row[1]?.client,
  );
  const rowSelectionCount = useGridSelector(
    apiRef,
    gridRowSelectionCountSelector,
  );
  const filterActiveItems = gridFilterActiveItemsSelector(apiRef);
  const filterModel = gridFilterModelSelector(apiRef);
  const _fields = gridColumnDefinitionsSelector(apiRef); // gridColumnFieldsSelector(apiRef);

  const columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef);
  // const [columnVisibilityModel, setColumnVisibilityModel] = useState(
  //   gridColumnVisibilityModelSelector(apiRef),
  // );
  const [columns, setColumns] = useState<GridColumnVisibilityModel>({});

  const environments = [
    {
      value: "multiApprove",
      label: "Multi Approve",
      icon: <GlobeIcon aria-hidden="true" className="size-3.5 opacity-60" />,
    },
    {
      value: "multiReject",
      label: "Multi Reject",
      icon: <LayersIcon aria-hidden="true" className="size-3.5 opacity-60" />,
    },
    {
      value: "multiDelete",
      label: "Multi Delete",
      icon: <TerminalIcon aria-hidden="true" className="size-3.5 opacity-60" />,
    },
  ];

  const [env, setEnv] = useState<string>("multiApprove");

  const fields: FilterFieldConfig[] = _fields.map((field) =>
    field.filterable
      ? {
          type:
            field.type === "string" || field.type === "number"
              ? "text"
              : field.type === "singleSelect"
                ? "select"
                : "custom",
          key: field.field,
          label: field.headerName,
          icon: <SlidersHorizontalIcon />,
          placeholder: "text to filter...",
          className: "w-28",
          validation: zodValidator(urlSchema),
        }
      : {},
  );

  const f = [
    {
      key: "status",
      label: "Status",
      icon: <ClockIcon className="size-3.5" />,
      type: "select",
      searchable: false,
      className: "w-[200px]",
      options: [
        { value: "todo", label: "To Do", icon: <StatusIcon status="todo" /> },
        {
          value: "in-progress",
          label: "In Progress",
          icon: <StatusIcon status="in-progress" />,
        },
        { value: "done", label: "Done", icon: <StatusIcon status="done" /> },
        {
          value: "cancelled",
          label: "Cancelled",
          icon: <StatusIcon status="cancelled" />,
        },
      ],
    },
    {
      key: "priority",
      label: "Priority",
      icon: <CircleAlertIcon className="size-3.5" />,
      type: "multiselect",
      className: "w-[180px]",
      options: [
        { value: "low", label: "Low", icon: <PriorityIcon priority="low" /> },
        {
          value: "medium",
          label: "Medium",
          icon: <PriorityIcon priority="medium" />,
        },
        {
          value: "high",
          label: "High",
          icon: <PriorityIcon priority="high" />,
        },
        {
          value: "urgent",
          label: "Urgent",
          icon: <PriorityIcon priority="urgent" />,
        },
      ],
    },
  ];

  const [filters, setFilters] = useState<any>([]);

  useEffect(() => {
    if (filterModel && filterModel.items.length > 0)
      setFilters(
        filterModel.items.map((item) => ({ ...item, values: [item.value] })),
      );
  }, [filterModel]);

  useEffect(() => {
    setColumns(columnVisibilityModel);
  }, [columnVisibilityModel]);

  const handleColumnVisibilityChange = useCallback(
    ({ field }: { field: string }, value: boolean) => {
      setColumnVisibilityModel({
        ...columnVisibilityModel,
        [field]: value,
      });
      changeVisibleColumns({
        ...columnVisibilityModel,
        [field]: value,
      });
      // setColumns({
      //   ...columns,
      //   [field]: value,
      // });
      // changeVisibleColumns({
      //   ...columns,
      //   [field]: value,
      // });
    },
    [],
  );

  const handleFiltersChange = useCallback((filter: Filter[]) => {
    setFilters(filter);
    changeFilters({
      ...filterModel,
      items: filter.map((f: any) => ({
        ...f,
        operator: f.operator,
        values: f.values,
        value: f.values[0],
      })),
    });
  }, []);

  const debounceFilter = debounce((field, value) => {
    handleFiltersChange(
      filters.map((filter: GridFilterItem) =>
        filter.field === field.key
          ? {
              ...filter,
              field: filter.field,
              values: [value],
              value,
            }
          : filter,
      ),
    );
  }, 1000);

  function FilterValueSelector({
    field,
    filter: { id, operator, values },
  }: {
    field: FilterFieldConfig;
    filter: { id: string; operator: string; values: [string[]] };
  }) {
    const noFieldOperators = operators
      .map(({ type, value }) => !type && value)
      .includes(operator);
    const textFieldOperators = operators
      .map(({ type, value }) => type === "text" && value)
      .includes(operator);
    const numericFieldOperators = operators
      .map(({ type, value }) => type === "numeric" && value)
      .includes(operator);
    const listFieldOperators = operators
      .map(({ type, value }) => type === "list" && value)
      .includes(operator);
    const rangeFieldOperators = operators
      .map(({ type, value }) => type === "range" && value)
      .includes(operator);
    const dateFieldOperators = operators
      .map(({ type, value }) => type === "date" && value)
      .includes(operator);
    const csvFieldOperators = operators
      .map(({ type, value }) => type === "csv" && value)
      .includes(operator);

    if (noFieldOperators) return null;

    if (textFieldOperators) {
      const [text, setText] = useState<string[] | string>(values[0]);
      return (
        <InputGroup>
          <InputGroupInput
            type={field.type}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              debounceFilter(field, event.target.value);
            }}
            // onKeyUp={(event) => {
            //   if (event.key === "Enter") {
            //     handleFiltersChange(
            //       filters.map((filter: GridFilterItem) =>
            //         filter.field === field.key
            //           ? {
            //               ...filter,
            //               field: filter.field,
            //               values: [(event.target as HTMLInputElement).value],
            //               value: (event.target as HTMLInputElement).value,
            //             }
            //           : filter,
            //       ),
            //     );
            //   }
            // }}
            placeholder={field.placeholder}
            pattern={field.pattern}
            className={field.className} //className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
            autoFocus={id === lastAddedFilterId}
          />
          <InputGroupAddon align="inline-end">
            {isLoading && <LoaderIcon className="animate-spin" />}
          </InputGroupAddon>
        </InputGroup>
      );
    }

    if (listFieldOperators) {
      const anchor = useComboboxAnchor();

      const [text, setText] = useState("");
      const [value, setValue] = useState<string[]>(
        (values as any)[0] === "" ? [] : values[0],
      );

      return (
        <Combobox
          multiple
          autoHighlight
          inputValue={text}
          onInputValueChange={(input: string, { event }: { event: any }) => {
            setText(input);
            if (event.key === "Enter") {
              setValue([...values[0], text]);
              debounceFilter(field, [...values[0], text]);
            }
          }}
        >
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              <Fragment>
                {value.map((value: string, key) => (
                  <ComboboxChip key={key} showRemove={false} className="pl-2">
                    {value}
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="-ml-1 -mr-2 opacity-50 hover:opacity-100"
                      onClick={() => {
                        setValue(values[0].filter((v: string) => v !== value));
                        debounceFilter(
                          field,
                          values[0].filter((v: string) => v !== value),
                        );
                      }}
                    >
                      <XIcon />
                    </Button>
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder={field.placeholder} />
              </Fragment>
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>Custom search items</ComboboxEmpty>
            <ComboboxList />
          </ComboboxContent>
        </Combobox>
      );
    }

    if (numericFieldOperators) {
      const [value, setValue] = useState<number | null>(0);
      return (
        <div>
          <NumberField
            defaultValue={0}
            value={value}
            onValueChange={(value) => {
              setValue(value);
              debounceFilter(field, value);
            }}
            min={0}
            size="lg"
            className="w-36"
          >
            <NumberFieldGroup className="rounded-none border-l-0">
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          </NumberField>
        </div>
      );
    }

    if (rangeFieldOperators) {
      const [from, setFrom] = useState<number | null>(0);
      const [to, setTo] = useState<number | null>(0);

      return (
        <div>
          <ButtonGroup>
            <ButtonGroupText className="bg-background dark:bg-input/30 text-nowrap rounded-none border-x-0 border-y-default-200">
              From
            </ButtonGroupText>

            <NumberField
              defaultValue={0}
              value={from}
              onValueChange={(value) => setFrom(value)}
              min={0}
              size="lg"
              className="w-36"
            >
              <NumberFieldGroup className="rounded-none border-l-0.5">
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldGroup>
            </NumberField>

            <ButtonGroupText className="bg-background dark:bg-input/30 text-nowrap rounded-none border-x-0 border-y-default-200">
              To
            </ButtonGroupText>

            <NumberField
              defaultValue={0}
              value={to}
              onValueChange={(value) => setTo(value)}
              min={0}
              size="lg"
              className="w-36"
            >
              <NumberFieldGroup className="rounded-none border-l-0.5">
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldGroup>
            </NumberField>
          </ButtonGroup>
        </div>
      );
    }

    if (dateFieldOperators) {
      const [value, setValue] = useState<DateSelectorValue | undefined>();
      const [open, setOpen] = useState(false);
      const [internalValue, setInternalValue] = useState<
        DateSelectorValue | undefined
      >(value);
      const formattedValue = value ? formatDateValue(value) : "";
      const displayText = formattedValue || "Select a date";
      useEffect(() => {
        if (open) setInternalValue(value);
      }, [open, value]);

      return (
        <ShadPopover open={open} onOpenChange={setOpen}>
          <ShadPopoverTrigger>
            <Button
              variant="outline"
              className="w-45 justify-start rounded-none border-l-0"
            >
              <CalendarIcon />
              {displayText}
            </Button>
          </ShadPopoverTrigger>

          <ShadPopoverContent
            className="w-auto gap-3 p-0"
            align="start"
            sideOffset={4}
          >
            <div className="p-3">
              <DateSelector
                value={internalValue}
                onChange={setInternalValue}
                allowRange={true}
                label="Select a date"
                inputHint="Try: 2025, Q4, 05/10/2025"
              />
            </div>
            <Separator className="p-0" />
            <div className="flex justify-end gap-2 p-3">
              <Button
                variant="outline"
                onClick={() => {
                  setInternalValue(value);
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setValue(internalValue);
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </ShadPopoverContent>
        </ShadPopover>
      );
    }

    if (csvFieldOperators) {
      const [text, setText] = useState<string[] | string>(values[0]);
      return (
        <InputGroup>
          <InputGroupInput
            type={field.type}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              debounceFilter(field, event.target.value);
            }}
            placeholder="input or paste list of comma separated values"
            pattern={field.pattern}
            className="w-xl"
            autoFocus={id === lastAddedFilterId}
          />
          <InputGroupAddon align="inline-end">
            {isLoading && <LoaderIcon className="animate-spin" />}
          </InputGroupAddon>
        </InputGroup>
      );
    }

    if (field.type === "select_" || field.type === "multiselect_") {
      const [open, setOpen] = useState(false);
      const [searchInput, setSearchInput] = useState("");
      const [highlightedIndex, setHighlightedIndex] = useState(-1);
      const inputRef = useRef<HTMLInputElement>(null);
      const baseId = useId();

      useEffect(() => {
        if (open) {
          inputRef.current?.focus();
        }
      }, [open]);

      useEffect(() => {
        setHighlightedIndex(-1);
      }, [searchInput, open]);

      useEffect(() => {
        if (highlightedIndex >= 0 && open) {
          const element = document.getElementById(
            `${baseId}-item-${highlightedIndex}`,
          );
          element?.scrollIntoView({ block: "nearest" });
        }
      }, [highlightedIndex, open, baseId]);

      const isMultiSelect = field.type === "multiselect" || values.length > 1;
      const effectiveValues =
        (field.value !== undefined ? field.value : values) || [];

      const selectedOptions =
        field.options?.filter((opt) => effectiveValues.includes(opt.value)) ||
        [];
      const unselectedOptions =
        field.options?.filter((opt) => !effectiveValues.includes(opt.value)) ||
        [];

      // Filter options based on search input
      const filteredSelectedOptions = selectedOptions; // Keep all selected visible
      const filteredUnselectedOptions = unselectedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchInput.toLowerCase()),
      );

      const allFilteredOptions = useMemo(
        () => [...filteredSelectedOptions, ...filteredUnselectedOptions],
        [filteredSelectedOptions, filteredUnselectedOptions],
      );

      const handleClose = () => {
        setOpen(false);
        //onClose?.();
      };

      const renderMenuContent = () => (
        <>
          {field.searchable !== false && (
            <>
              <Input
                ref={inputRef}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={true}
                aria-haspopup="listbox"
                aria-controls={`${baseId}-listbox`}
                aria-activedescendant={
                  highlightedIndex >= 0
                    ? `${baseId}-item-${highlightedIndex}`
                    : undefined
                }
                placeholder={field.label || ""}
                className={cn(
                  "border-input h-8 rounded-none border-0 bg-transparent! px-2 text-sm shadow-none",
                  "focus-visible:border-border focus-visible:ring-0 focus-visible:ring-offset-0",
                  open && "placeholder:text-foreground",
                )}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onBlur={() => open && inputRef.current?.focus()}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (allFilteredOptions.length > 0) {
                      setHighlightedIndex((prev) =>
                        prev < allFilteredOptions.length - 1 ? prev + 1 : 0,
                      );
                    }
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (allFilteredOptions.length > 0) {
                      setHighlightedIndex((prev) =>
                        prev > 0 ? prev - 1 : allFilteredOptions.length - 1,
                      );
                    }
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    setOpen(false);
                  } else if (e.key === "Enter" && highlightedIndex >= 0) {
                    e.preventDefault();
                    const option = allFilteredOptions[highlightedIndex];
                    if (option) {
                      const isSelected = effectiveValues.includes(
                        option.value as any,
                      );
                      const next = isSelected
                        ? (effectiveValues.filter(
                            (v: any) => v !== option.value,
                          ) as any)
                        : isMultiSelect
                          ? ([...effectiveValues, option.value] as any)
                          : ([option.value] as any);

                      if (
                        !isSelected &&
                        isMultiSelect &&
                        field.maxSelections &&
                        next.length > field.maxSelections
                      ) {
                        return;
                      }

                      if (field.onValueChange) {
                        field.onValueChange(next);
                      } else {
                        onChange(next);
                      }
                      if (!isMultiSelect) handleClose();
                    }
                  }
                  e.stopPropagation();
                }}
              />
              <DropdownMenuSeparator />
            </>
          )}
          <div className="relative flex max-h-full">
            <div
              className="flex max-h-[min(var(--available-height),24rem)] w-full scroll-pt-2 scroll-pb-2 flex-col overscroll-contain"
              role="listbox"
              id={`${baseId}-listbox`}
            >
              <ScrollArea className="size-full min-h-0 **:data-[slot=scroll-area-scrollbar]:m-0 [&_[data-slot=scroll-area-viewport]]:h-full [&_[data-slot=scroll-area-viewport]]:overscroll-contain">
                {allFilteredOptions.length === 0 && (
                  <div className="text-muted-foreground py-2 text-center text-sm">
                    No results found
                  </div>
                )}

                {/* Selected items */}
                {filteredSelectedOptions.length > 0 && (
                  <DropdownMenuGroup className="px-1">
                    {filteredSelectedOptions.map((option, index) => {
                      const isHighlighted = highlightedIndex === index;
                      const itemId = `${baseId}-item-${index}`;

                      return (
                        <DropdownMenuCheckboxItem
                          key={String(option.value)}
                          id={itemId}
                          role="option"
                          aria-selected={isHighlighted}
                          data-highlighted={isHighlighted || undefined}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          checked={true}
                          className={cn(
                            "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
                            option.className,
                          )}
                          onSelect={(e) => {
                            if (isMultiSelect) e.preventDefault();
                          }}
                          onCheckedChange={() => {
                            const next = effectiveValues.filter(
                              (v) => v !== option.value,
                            ) as any;
                            if (field.onValueChange) {
                              field.onValueChange(next);
                            } else {
                              onChange(next);
                            }
                            if (!isMultiSelect) handleClose();
                          }}
                        >
                          {option.icon && option.icon}
                          <span className="truncate">{option.label}</span>
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuGroup>
                )}

                {/* Separator */}
                {filteredSelectedOptions.length > 0 &&
                  filteredUnselectedOptions.length > 0 && (
                    <DropdownMenuSeparator className="mx-0" />
                  )}

                {/* Available items */}
                {filteredUnselectedOptions.length > 0 && (
                  <DropdownMenuGroup className="px-1">
                    {filteredUnselectedOptions.map((option, index) => {
                      const overallIndex =
                        index + filteredSelectedOptions.length;
                      const isHighlighted = highlightedIndex === overallIndex;
                      const itemId = `${baseId}-item-${overallIndex}`;

                      return (
                        <DropdownMenuCheckboxItem
                          key={String(option.value)}
                          id={itemId}
                          role="option"
                          aria-selected={isHighlighted}
                          data-highlighted={isHighlighted || undefined}
                          onMouseEnter={() => setHighlightedIndex(overallIndex)}
                          checked={false}
                          className={cn(
                            "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
                            option.className,
                          )}
                          onSelect={(e) => {
                            if (isMultiSelect) e.preventDefault();
                          }}
                          onCheckedChange={() => {
                            const next = isMultiSelect
                              ? ([...effectiveValues, option.value] as any)
                              : ([option.value] as any);

                            if (
                              isMultiSelect &&
                              field.maxSelections &&
                              next.length > field.maxSelections
                            ) {
                              return;
                            }

                            if (field.onValueChange) {
                              field.onValueChange(next);
                            } else {
                              onChange(next);
                            }
                            if (!isMultiSelect) handleClose();
                          }}
                        >
                          {option.icon && option.icon}
                          <span className="truncate">{option.label}</span>
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuGroup>
                )}
              </ScrollArea>
            </div>
          </div>
        </>
      );

      // if (inline) {
      //   return <div className="w-full">{renderMenuContent()}</div>;
      // }

      return (
        <DropdownMenu
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              setTimeout(() => setSearchInput(""), 200);
            }
          }}
        >
          <DropdownMenuTrigger
            children={
              <Button variant="outline" size="sm">
                <div className="flex items-center gap-1.5">
                  {field.customValueRenderer ? (
                    field.customValueRenderer(values, field.options || [])
                  ) : (
                    <>
                      {selectedOptions.length > 0 && (
                        <div className="flex items-center -space-x-1.5">
                          {selectedOptions.slice(0, 3).map((option) => (
                            <div key={String(option.value)}>{option.icon}</div>
                          ))}
                        </div>
                      )}
                      {selectedOptions.length === 1
                        ? selectedOptions[0].label
                        : selectedOptions.length > 1
                          ? `${selectedOptions.length} selected`
                          : "selected"}
                    </>
                  )}
                </div>
              </Button>
            }
          />
          <DropdownMenuContent
            align="start"
            className={cn("w-[200px] px-0", field.className)}
          >
            {renderMenuContent()}
          </DropdownMenuContent>
        </DropdownMenu>
      );
      // return (
      //   <SelectOptionsPopover field={field} values={values} onChange={onChange} />
      // );
    }

    if (field.customRenderer) {
      return (
        <ButtonGroupText className="hover:bg-accent aria-expanded:bg-accent bg-background dark:bg-input/30 text-start whitespace-nowrap outline-hidden">
          {field.customRenderer({ field, values, onChange, operator })}
        </ButtonGroupText>
      );
    }
  }

  function FilterSubmenuContent({
    field,
    currentValues,
    isMultiSelect,
    onToggle,
    isActive,
    onActive,
  }: any) {
    const [searchInput, setSearchInput] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const baseId = useId();

    useEffect(() => {
      if (isActive) {
        if (field.searchable !== false) {
          inputRef.current?.focus();
        } else {
          const listbox = document.getElementById(`${baseId}-listbox`);
          listbox?.focus();
        }
      }
    }, [isActive, field.searchable, baseId]);

    useEffect(() => {
      setHighlightedIndex(-1);
    }, [searchInput]);

    useEffect(() => {
      if (highlightedIndex >= 0 && isActive) {
        const element = document.getElementById(
          `${baseId}-item-${highlightedIndex}`,
        );
        element?.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex, isActive, baseId]);

    const filteredOptions = useMemo(() => {
      return (
        field.options?.filter((option: { value: any; label: string }) => {
          const isSelected = currentValues.includes(option.value);
          if (isSelected) return true;
          if (!searchInput) return true;
          return option.label.toLowerCase().includes(searchInput.toLowerCase());
        }) || []
      );
    }, [field.options, searchInput, currentValues]);

    useEffect(() => {
      if (isActive && filteredOptions.length > 0) {
        setHighlightedIndex(0);
      }
    }, [isActive, filteredOptions.length]);

    return (
      <div className="flex flex-col" onMouseEnter={onActive}>
        {field.searchable !== false && (
          <>
            <Input
              ref={inputRef}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={true}
              aria-haspopup="listbox"
              aria-controls={`${baseId}-listbox`}
              aria-activedescendant={
                highlightedIndex >= 0
                  ? `${baseId}-item-${highlightedIndex}`
                  : undefined
              }
              placeholder={`Search ${field.label}`}
              className={cn(
                "h-8 rounded-none border-0 bg-transparent! px-2 text-sm shadow-none",
                "focus-visible:border-border focus-visible:ring-0 focus-visible:ring-offset-0",
                isActive && "placeholder:text-foreground",
              )}
              value={searchInput}
              onBlur={() => isActive && inputRef.current?.focus()}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => onActive?.()}
              onMouseEnter={(e) => {
                onActive?.();
                e.stopPropagation();
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <DropdownMenuSeparator />
          </>
        )}
        <div className="relative flex max-h-full">
          <div
            className="flex max-h-[min(var(--available-height),24rem)] w-full scroll-pt-2 scroll-pb-2 flex-col overscroll-contain outline-hidden"
            role="listbox"
            id={`${baseId}-listbox`}
            tabIndex={field.searchable === false ? 0 : -1}
          >
            <ScrollArea className="size-full min-h-0 **:data-[slot=scroll-area-scrollbar]:m-0 [&_[data-slot=scroll-area-viewport]]:h-full [&_[data-slot=scroll-area-viewport]]:overscroll-contain">
              {filteredOptions.length === 0 ? (
                <div className="text-muted-foreground py-2 text-center text-sm">
                  No Results Found
                </div>
              ) : (
                <DropdownMenuGroup>
                  {filteredOptions.map((option: any, index: number) => {
                    const isSelected = currentValues.includes(option.value);
                    const isHighlighted = highlightedIndex === index;
                    const itemId = `${baseId}-item-${index}`;

                    return (
                      <DropdownMenuCheckboxItem
                        key={String(option.value)}
                        id={itemId}
                        role="option"
                        aria-selected={isHighlighted}
                        data-highlighted={isHighlighted || undefined}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        checked={isSelected}
                        className={cn(
                          "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
                          option.className,
                        )}
                        onSelect={(e) => {
                          if (isMultiSelect) e.preventDefault();
                        }}
                        onCheckedChange={() =>
                          onToggle(option.value, isSelected)
                        }
                      >
                        {option.icon && option.icon}
                        <span className="truncate">{option.label}</span>
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuGroup>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    );
  }

  const allowMultiple = true;

  const [addFilterOpen, setAddFilterOpen] = useState(false);

  const [menuSearchInput, setMenuSearchInput] = useState("");
  const [activeMenu, setActiveMenu] = useState<string>("root");
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [lastAddedFilterId, setLastAddedFilterId] = useState<string | null>(
    null,
  );
  const rootInputRef = useRef<HTMLInputElement>(null);
  const rootId = useId();
  const [sessionFilterIds, setSessionFilterIds] = useState<
    Record<string, string>
  >({});

  const isFieldGroup = (item: any) => {
    return "fields" in item && Array.isArray(item.fields);
  };

  const isGroupLevelField = (field: any) => {
    return Boolean(field.group && field.fields);
  };

  const flattenFields = (fields: any) => {
    return fields.reduce((acc, item) => {
      if (isFieldGroup(item)) {
        return [...acc, ...item.fields];
      }
      // Handle group-level fields (new structure)
      if (isGroupLevelField(item)) {
        return [...acc, ...item.fields!];
      }
      return [...acc, item];
    }, []);
  };

  const selectableFields = useMemo(() => {
    const flatFields = flattenFields(fields);
    return flatFields.filter((field: any) => {
      if (!field.key || field.type === "separator") return false;
      if (allowMultiple) return true;
      return !filters.some((filter: any) => filter.field === field.key);
    });
  }, [fields, filters, allowMultiple]);

  const filteredFields = useMemo(() => {
    return selectableFields.filter(
      (f: any) =>
        !menuSearchInput ||
        f.label?.toLowerCase().includes(menuSearchInput.toLowerCase()),
    );
  }, [selectableFields, menuSearchInput]);

  const getFieldsMap = (fields: any) => {
    const flatFields = flattenFields(fields);
    return flatFields.reduce((acc: any, field: any) => {
      // Only add fields that have a key (skip group-level configurations)
      if (field.key) {
        acc[field.key] = field;
      }
      return acc;
    }, {} as any);
  };

  const fieldsMap = useMemo(() => getFieldsMap(fields), [fields]);

  const addFilter = useCallback(
    (fieldKey: string) => {
      const field = fieldsMap[fieldKey];
      if (field && field.key) {
        const defaultOperator =
          field.defaultOperator ||
          (field.type === "multiselect" ? "is_any_of" : "contains");
        const defaultValues: unknown[] = field.type === "text" ? [""] : [];
        const newFilter = createFilter(
          fieldKey,
          defaultOperator,
          defaultValues as any,
        );
        setLastAddedFilterId(newFilter.id);
        handleFiltersChange([...filters, newFilter]);
        setAddFilterOpen(false);
        setMenuSearchInput("");
      }
    },
    [fieldsMap, filters],
  );

  return (
    <>
      <Confirm
        handleConfirm={() => {
          closeConfirm();
          switch (confirmOperation) {
            case "reset":
              resetPassword(rowSelection, {
                onSuccess: () => {
                  showAlert({
                    status: "success",
                    subject: "Password reset!",
                    body: `Password was reset and sent to the user.`,
                  });
                  changeRowSelection([]);
                },
                onError: (error: any) =>
                  showAlert({
                    status: "error",
                    subject: error.response.data.subject || "Reset Error!",
                    body:
                      error.response.data.body ||
                      "An issue occurred while attempting to reset password. Please try again.",
                  }),
              });
              break;
            case "delete":
              deleteData(rowSelection, {
                onSuccess: ({ data }) => {
                  addToast({
                    title: "Success",
                    description: `${apiUrl}${
                      data.length === 1 ? "" : "s"
                    } deleted!`,
                    color: "success",
                    variant: "flat",
                    icon: <GoTrash size={25} />,
                    timeout: 3000,
                  });
                  changeRowSelection([]);
                  handleGetData();
                },
                onError: () =>
                  showAlert({
                    status: "error",
                    subject: "Deletion Error!",
                    body: `Error occurred while attempting to delete item`,
                  }),
              });
              break;
            case "multiAction":
              multiAction(
                { action: "multi-approve", ids: rowSelection },
                {
                  onSuccess: ({ data }) => {
                    setSnackBar({
                      status: "success",
                      duration: 3000,
                      message: `row${data.length === 1 ? "" : "s"} approved!`,
                    });
                    changeRowSelection([]);
                    handleGetData();
                  },
                  onError: () =>
                    showAlert({
                      status: "error",
                      subject: "Multi-Approval Error!",
                      body: `Error occurred while attempting to approve record(s)`,
                    }),
                },
              );
          }
        }}
        handleCancel={() => (clearRowSelection(), closeConfirm())}
        okText="YES"
        cancelText="NO"
      />

      <ScrollArea className="max-w-auto p-3">
        <div className="flex gap-5">
          <ButtonGroup>
            {/* Add item */}
            {!exclude?.includes("add") && (
              <Button variant="outline" onClick={() => setIsAddItemOpen(true)}>
                <PlusIcon />
                <Badge size="sm">Add</Badge>
              </Button>
            )}

            {/* Refresh */}
            <Button
              variant="outline"
              onClick={handleGetData}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : <RefreshCWIcon />}
              <span>Refresh</span>
            </Button>

            {/* Filter */}
            <DropdownMenu
              open={addFilterOpen}
              onOpenChange={(open) => {
                setAddFilterOpen(open);
                if (!open) {
                  setMenuSearchInput("");
                  setSessionFilterIds({});
                } else {
                  setActiveMenu("root");
                }
              }}
            >
              <DropdownMenuTrigger
                children={
                  <Button
                    variant={filters!.length > 0 ? "default" : "outline"}
                    className="rounded-l-none border-l-0"
                  >
                    <SlidersHorizontalIcon />
                    <Badge
                      color="primary"
                      content={`${filterModel.items.length}`}
                      size="sm"
                      variant="faded"
                      hidden={filterModel.items.length === 0}
                      className={cn(
                        "top-1",
                        filterModel.items.length !== 0 && "left-10",
                      )}
                    >
                      <span>Filters</span>
                      <div
                        className={cn(
                          "size-1.5 animate-pulse rounded-full bg-green-600 text-muted-foreground hover:text-foreground",
                          filterModel.items.length !== 0 && "mr-2",
                        )}
                      />
                    </Badge>
                  </Button>
                }
              />
              <DropdownMenuContent align="start">
                <Input
                  ref={rootInputRef}
                  placeholder="Filter..."
                  className={cn(
                    "h-8 rounded-none border-0 bg-transparent! px-2 text-sm shadow-none",
                    "focus-visible:border-border focus-visible:ring-0 focus-visible:ring-offset-0",
                  )}
                  value={menuSearchInput}
                  onChange={(e) => setMenuSearchInput(e.target.value)}
                />

                <DropdownMenuSeparator />

                <div
                  className="flex max-h-[min(var(--available-height),24rem)] w-full scroll-pt-2 scroll-pb-2 flex-col overscroll-contain"
                  id={`${rootId}-listbox`}
                  onMouseEnter={() => setActiveMenu("root")}
                >
                  <ScrollArea className="**:data-[slot=scroll-area-scrollbar]:m-0">
                    {(() => {
                      if (filteredFields.length === 0) {
                        return (
                          <div className="text-muted-foreground py-2 text-center text-sm">
                            No filters found.
                          </div>
                        );
                      }

                      return filteredFields.map((field: any, index: number) => {
                        const isHighlighted = highlightedIndex === index;
                        const itemId = `${rootId}-item-${index}`;
                        const hasSubMenu =
                          (field.type === "select" ||
                            field.type === "multiselect") &&
                          field.options?.length;

                        if (hasSubMenu) {
                          const isMultiSelect = field.type === "multiselect";
                          const fieldKey = field.key as string;
                          const sessionFilterId = sessionFilterIds[fieldKey];
                          const sessionFilter = sessionFilterId
                            ? filters.find((f: any) => f.id === sessionFilterId)
                            : null;
                          const currentValues = sessionFilter?.values || [];

                          return (
                            <DropdownMenuSub
                              key={fieldKey}
                              open={openSubMenu === fieldKey}
                              onOpenChange={(open) => {
                                if (open) {
                                  setOpenSubMenu(fieldKey);
                                } else {
                                  if (openSubMenu === fieldKey) {
                                    setOpenSubMenu(null);
                                    setActiveMenu("root");
                                  }
                                }
                              }}
                            >
                              <DropdownMenuSubTrigger
                                id={itemId}
                                role="option"
                                aria-selected={isHighlighted}
                                data-highlighted={isHighlighted || undefined}
                                onMouseEnter={() => {
                                  setHighlightedIndex(index);
                                  setActiveMenu("root");
                                }}
                                className="data-popup-open:bg-accent data-popup-open:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                              >
                                {field.icon}
                                <span>{field.label}</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <FilterSubmenuContent
                                  field={field}
                                  currentValues={currentValues}
                                  isMultiSelect={isMultiSelect}
                                  isActive={activeMenu === fieldKey}
                                  onActive={() => {
                                    if (field.searchable !== false) {
                                      setActiveMenu(fieldKey);
                                    }
                                  }}
                                  onBack={() => {
                                    setOpenSubMenu(null);
                                    setActiveMenu("root");
                                  }}
                                  onClose={() => setAddFilterOpen(false)}
                                  onToggle={(value, isSelected) => {
                                    if (isMultiSelect) {
                                      const nextValues = isSelected
                                        ? (currentValues.filter(
                                            (v: any) => v !== value,
                                          ) as any)
                                        : ([...currentValues, value] as any);

                                      if (sessionFilter) {
                                        if (nextValues.length === 0) {
                                          onChange(
                                            filters.filter(
                                              (f: any) =>
                                                f.id !== sessionFilter.id,
                                            ),
                                          );
                                          setSessionFilterIds((prev) => ({
                                            ...prev,
                                            [fieldKey]: "",
                                          }));
                                        } else {
                                          onChange(
                                            filters.map((f: any) =>
                                              f.id === sessionFilter.id
                                                ? { ...f, values: nextValues }
                                                : f,
                                            ),
                                          );
                                        }
                                      } else {
                                        const newFilter = createFilter(
                                          fieldKey,
                                          field.defaultOperator || "is_any_of",
                                          nextValues,
                                        );
                                        onChange([...filters, newFilter]);
                                        setSessionFilterIds((prev) => ({
                                          ...prev,
                                          [fieldKey]: newFilter.id,
                                        }));
                                      }
                                    } else {
                                      const newFilter = createFilter(
                                        fieldKey,
                                        field.defaultOperator || "is",
                                        [value] as any,
                                      );
                                      setLastAddedFilterId(newFilter.id);
                                      onChange([...filters, newFilter]);
                                      setAddFilterOpen(false);
                                    }
                                  }}
                                />
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          );
                        }

                        return (
                          <DropdownMenuItem
                            key={field.key}
                            id={itemId}
                            data-highlighted={isHighlighted || undefined}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            onClick={() => field.key && addFilter(field.key)}
                            className="data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                          >
                            {field.icon}
                            <span>{field.label}</span>
                          </DropdownMenuItem>
                        );
                      });
                    })()}
                  </ScrollArea>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {false && (
              <FilterPanelTrigger
                title="edf"
                render={
                  <Button variant={filters!.length > 0 ? "default" : "outline"}>
                    <SlidersHorizontalIcon />
                  </Button>
                }
              />
            )}
          </ButtonGroup>

          <ButtonGroup>
            {/* Columns */}
            {!exclude?.includes("columns") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <GalleryHorizontalEndIcon />
                    Columns
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="opacity-60"
                    />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="max-w-60">
                  <DropdownMenuGroup>
                    {_fields.map(
                      (field, key) =>
                        field.hideable && (
                          <DropdownMenuCheckboxItem
                            key={key}
                            checked={columns[field.field]}
                            onCheckedChange={(value) => {
                              setColumns({ ...columns, [field.field]: value });
                              changeVisibleColumns({
                                ...columns,
                                [field.field]: value,
                              });
                            }}
                          >
                            {[field.headerName]}
                          </DropdownMenuCheckboxItem>
                        ),
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* MUI Columns trigger */}
            {false && (
              <ColumnsPanelTrigger
                render={
                  <Button variant="outline">
                    <GalleryHorizontalEndIcon />
                    <span>Columns</span>
                  </Button>
                }
              />
            )}

            {/* Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isExporting}>
                  <HardDriveDownloadIcon />
                  Export{isExporting && "ing"}
                  {isExporting && (
                    <Spinner size="sm" variant="dots" className="-ml-1" />
                  )}
                  <ChevronDownIcon aria-hidden="true" className="opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              {!exclude?.includes("exporting") && exportURL && (
                <DropdownMenuContent align="end" className="max-w-60">
                  <p className="text-xs p-2">
                    Note that exporting the data without any filters will
                    attempt to export the whole dataset which may fail.
                  </p>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setIsExporting(true);
                      axios
                        .get(exportURL)
                        .then(({ data }) => {
                          location.href = data;
                          setIsExporting(false);
                        })
                        .catch((e) => {
                          setIsExporting(false);
                          // showAlert({
                          //   status: "error",
                          //   subject: "Export error!",
                          //   body:
                          //     e.message ||
                          //     "Error occurred while attempting to export users",
                          // });
                        });
                    }}
                  >
                    <PiMicrosoftExcelLogoDuotone size={65} />
                    XLSX
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BsFiletypeCsv />
                    CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <BsFileEarmarkPdfFill />
                    PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </ButtonGroup>

          {/* Selections */}
          {rowSelectionCount > 1 && (
            <ButtonGroup>
              <Popover showArrow backdrop="blur" offset={10} placement="bottom">
                <PopoverTrigger>
                  <Button variant="default" className="border-primary">
                    <SquareStackIcon />
                    <u>View Selections</u>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  {(titleProps) => {
                    const [feedback, setFeedback] = useState("");
                    const maxLength = 255;

                    return (
                      <div className="px-1 py-2 max-w-80">
                        <p
                          className="text-medium font-bold text-foreground"
                          {...titleProps}
                        >
                          Selection verification
                        </p>

                        <div className="my-2">
                          {`The below ${rowSelectionCount} items have been selected.`}
                        </div>

                        <ScrollArea
                          className={`rounded-lg h-${rowSelectionCount * 4} min-h-${rowSelectionCount <= 2 ? "19" : "24"} max-h-48 border mb-3`}
                        >
                          <div className="px-4">
                            <div className="flex flex-col divide-y">
                              {rowSelections.map((row, key) => (
                                <div
                                  key={key}
                                  className="flex flex-row items-center gap-2 py-2 text-sm"
                                >
                                  <SquareCheckBig
                                    size={20}
                                    className="text-success"
                                  />
                                  {row}
                                </div>
                              ))}
                            </div>
                          </div>
                        </ScrollArea>

                        <InputGroup>
                          <InputGroupTextarea
                            placeholder="Enter feedback here"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            maxLength={maxLength}
                            //className="min-h-8 pb-12"
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="text-muted-foreground text-xs">
                              {feedback.length}/{maxLength} characters
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>

                        <Separator orientation="horizontal" />

                        <div className="flex flex-row gap-0 divide-x border my-3 rounded-lg">
                          <Button
                            variant="ghost"
                            className="border-border flex-1 rounded-none p-0"
                            onClick={() =>
                              showConfirm({
                                operation: "approve",
                                status: "info",
                                subject: `Confirm approval`,
                                body: `Are you sure you intend to approve the selected rows?`,
                              })
                            }
                          >
                            Multi-approve
                          </Button>

                          <Button
                            variant="ghost"
                            className="border-border flex-1 rounded-l-none border-0 p-0"
                            onClick={() =>
                              showConfirm({
                                operation: "reject",
                                status: "info",
                                subject: `Confirm rejection`,
                                body: `Are you sure you intend to reject the selected rows?`,
                              })
                            }
                          >
                            Multi-reject
                          </Button>
                        </div>

                        <div className="flex flex-1 justify-center">
                          <Button
                            variant="destructive"
                            className="border-border border-0"
                            onClick={() =>
                              showConfirm({
                                operation: "delete",
                                status: "info",
                                subject: `Confirm deletion`,
                                body: `Are you sure you intend to delete the selected rows?`,
                              })
                            }
                          >
                            Multi-delete
                          </Button>
                        </div>
                      </div>
                    );
                  }}
                </PopoverContent>
              </Popover>

              <ButtonGroupText className="text-nowrap">
                {rowSelectionCount} items
              </ButtonGroupText>

              <Button
                variant="destructive"
                onClick={() => clearRowSelection()}
                disabled={isLoading}
                className="border-primary"
              >
                <XIcon />
              </Button>
            </ButtonGroup>
          )}

          <div className="flex-1" />

          <QuickFilter>
            <QuickFilterControl
              render={({ ref, ...controlProps }, state) => {
                const [value, setValue] = useState(state.value);
                return (
                  <ButtonGroup className="w-48">
                    <InputGroup>
                      <InputGroupInput
                        {...controlProps}
                        ref={ref}
                        size={10}
                        placeholder="Search..."
                        className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyUp={(e) =>
                          e.key === "Enter" &&
                          changeFilters({
                            ...filterModel,
                            quickFilterValues: [
                              (e.target as HTMLInputElement).value,
                            ],
                          })
                        }
                      />
                      <InputGroupAddon>
                        <SearchIcon className="text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        {isLoading && <LoaderIcon className="animate-spin" />}
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        {value.length > 0 && (
                          <XIcon
                            size={16}
                            className="cursor-pointer"
                            onClick={() => {
                              setValue("");
                              changeFilters({
                                ...filterModel,
                                quickFilterValues: [""],
                              });
                            }}
                          />
                        )}
                      </InputGroupAddon>
                    </InputGroup>
                  </ButtonGroup>
                );
              }}
            />
          </QuickFilter>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVerticalIcon size={24} />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {extraActions && (
                <DropdownMenuGroup>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuGroup>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  localStorage.removeItem(`_${apiUrl}_filtered_columns`);
                  localStorage.removeItem(`_${apiUrl}_pagination`);
                  localStorage.removeItem(`_${apiUrl}_pinned_columns`);
                  localStorage.removeItem(`_${apiUrl}_selected_rows`);
                  localStorage.removeItem(`_${apiUrl}_sorted_columns`);
                  localStorage.removeItem(`_${apiUrl}_state`);
                  localStorage.removeItem(`_${apiUrl}_visible_columns`);
                  localStorage.removeItem(`_${apiUrl}_stats`);
                  location.reload();
                }}
              >
                <CogIcon />
                Reset defaults
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className={`flex gap-5 ${extraActions ? "pt-3" : ""}`}>
          {/* {extraActions} */}

          <div className="w-0 flex-wrap flex flex-1 gap-1">
            {filters.map((filter: any, i: number) => {
              const field = fields.find((field) => field.key === filter.field);
              if (!field) return null;

              return (
                <>
                  <ButtonGroup key={filter.id}>
                    <ButtonGroupText className="bg-background dark:bg-input/30 text-nowrap">
                      {field.icon && field.icon}
                      {field.label}
                    </ButtonGroupText>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {lowerCase(startCase(filter.operator)) ?? "contains"}
                          <ChevronDownIcon className="ml-auto size-4 opacity-60" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="start"
                        className="w-fit min-w-fit"
                      >
                        {operators.map((operator, key) =>
                          operator.type === "divider" ? (
                            <DropdownMenuSeparator />
                          ) : (
                            <DropdownMenuItem
                              key={key}
                              onClick={() =>
                                handleFiltersChange(
                                  filters.map((filter: any) =>
                                    filter.field === field.key
                                      ? { ...filter, operator: operator.value }
                                      : filter,
                                  ),
                                )
                              }
                              className={cn(
                                "data-highlighted:bg-accent data-highlighted:text-accent-foreground flex items-center justify-between",
                              )}
                            >
                              <span>
                                {lowerCase(startCase(operator.value))}
                              </span>
                              <CheckIcon
                                className={`${cn("text-primary ms-auto", operator.value === filter.operator ? "opacity-100" : "opacity-0")}`}
                              />
                            </DropdownMenuItem>
                          ),
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <FilterValueSelector field={field} filter={filter} />

                    <Button
                      variant="outline"
                      onClick={() =>
                        handleFiltersChange([
                          ...filters.filter(
                            ({ id }: { id: string }) => id !== filter.id,
                          ),
                        ])
                      }
                    >
                      <XIcon />
                    </Button>
                  </ButtonGroup>

                  {i !== filters.length - 1 && (
                    <Button
                      variant="link"
                      className="text-primary"
                      disabled={i > 0}
                      onClick={() =>
                        changeFilters({
                          ...filterModel,
                          logicOperator:
                            filterModel.logicOperator === GridLogicOperator.And
                              ? GridLogicOperator.Or
                              : GridLogicOperator.And,
                        })
                      }
                    >
                      {filterModel.logicOperator?.toUpperCase()}
                    </Button>
                  )}
                </>
              );
            })}
          </div>

          {filterModel.items.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => {
                setFilters([]);
                clearFilters();
              }}
            >
              <FunnelXIcon />
              Clear
            </Button>
          )}
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Separator
        orientation="horizontal"
        className="data-[orientation=horizontal]:h-0.5"
      />
    </>
  );
}
