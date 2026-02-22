"use client";

// * React
import { useCallback, useState } from "react";

// * NPM
import dayjs, { Dayjs } from "dayjs";

// * MUI
import {
  GridCellParams,
  GridFilterInputValueProps,
  GridFilterItem,
} from "@mui/x-data-grid-pro";
import {
  DateRange,
  DateRangePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import { Button } from "../ui/shadcn/button";
import {
  AtSignIcon,
  CreditCardIcon,
  GlobeIcon,
  LinkIcon,
  ListFilterIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";

export const textFilter = [
  {
    label: "contains",
    value: "contains",
    getApplyFilterFn: ({ id, field, value, operator }: GridFilterItem) => {
      console.log(field, value, operator);
      if (!field || !value || !operator) return null;
      return (params: GridCellParams): boolean => value[0] <= value[1];
    },
    InputComponent: (props: GridFilterInputValueProps) => {
      const { item, applyValue } = props;
      const [dateRange] = useState<DateRange<Dayjs>>([null, dayjs()]);

      return (
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "end",
            width: 250,
            pr: 1,
          }}
        ></Box>
      );
    },
  },
];

export const dateFilter = [
  {
    label: "between",
    value: "between",
    getApplyFilterFn: ({ field, value, operator }: GridFilterItem) => {
      if (!field || !value || !operator) return null;
      return (params: GridCellParams): boolean => value[0] <= value[1];
    },
    InputComponent: (props: GridFilterInputValueProps) => {
      const { item, applyValue } = props;
      const [dateRange] = useState<DateRange<Dayjs>>([null, dayjs()]);

      return (
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "end",
            width: 250,
            pr: 1,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              defaultValue={dateRange}
              format="DD/MM/YYYY"
              localeText={{ start: "Start date", end: "End date" }}
              maxDate={dayjs()}
              onChange={(value) => applyValue({ ...item, value })}
              value={dateRange}
              slotProps={{
                fieldSeparator: { children: "to" },
                textField: {
                  size: "small",
                  variant: "outlined",
                  InputProps: { sx: { width: 120 } },
                },
              }}
            />
          </LocalizationProvider>
        </Box>
      );
    },
  },
];

export const booleanFilter = [
  {
    label: "equals",
    value: "equals",
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }

      return (): boolean => {
        return filterItem.value;
      };
    },
    InputComponent: (props: any) => {
      const { item, applyValue } = props;
      return (
        <Stack
          direction="row"
          component="label"
          alignItems="center"
          justifyContent="center"
        >
          <Typography>Inactive</Typography>
          <Switch
            checked={item.value === "1" ? true : false}
            onChange={(e) =>
              applyValue({
                ...item,
                value: e.target.checked ? "1" : "0",
              })
            }
          />
          <Typography>Active</Typography>
        </Stack>
      );
    },
  },
];

export const selectFilter = (selectItems: string[], label: string) => [
  {
    label: "is",
    value: "is",
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }
      return ({ value }: { value?: string }): boolean =>
        value === filterItem.value;
    },
    InputComponent: (props: any) => {
      const { item, applyValue } = props;

      return (
        <TextField
          variant="outlined"
          size="small"
          label={label}
          fullWidth
          select
          defaultValue=""
          value={item.value}
          onChange={(e) => applyValue({ ...item, value: e.target.value })}
        >
          {selectItems.map((item, key) => (
            <MenuItem key={key} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      );
    },
  },
];
