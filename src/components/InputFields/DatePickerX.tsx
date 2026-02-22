// * NPM
import {
  DateTimePicker,
  DateTimePickerProps,
  LocalizationProvider,
  renderTimeViewClock,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { FieldValues, SetFieldValue } from "react-hook-form";
import { Grid, GridSize } from "@mui/material";
import { grey } from "@mui/material/colors";
import dayjs from "dayjs";

// * Icons
import { HiOutlineCalendarDateRange } from "react-icons/hi2";

export default function DatePickerX(
  props: DateTimePickerProps & {
    columnspan?: {};
    field: string;
    helperText?: string;
    label: string;
    setValue: SetFieldValue<FieldValues>;
  }
) {
  const { columnspan, field, helperText, label, setValue } = props;

  return (
    <Grid size={columnspan}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          {...props}
          closeOnSelect
          format="DD/MM/YYYY hh:mm:ss a"
          label={label}
          orientation="landscape"
          onOpen={() => setValue(field, undefined!, { shouldTouch: true })}
          onChange={(v) =>
            setValue(field, dayjs(v).toDate(), {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          slots={{
            openPickerIcon: () => <HiOutlineCalendarDateRange size={25} />,
          }}
          slotProps={{
            openPickerButton: { color: "primary" },
            textField: {
              fullWidth: true,
              helperText,
              size: "small",
              variant: "filled",
              InputProps: {
                sx: (theme) => ({
                  borderRadius: 2,
                  border: `1px solid ${grey[600]}`,
                  "&.MuiPickersFilledInput-root": [
                    {
                      backgroundColor: theme.vars.palette.grey[100],
                      border: `1px solid ${theme.vars.palette.grey[300]}`,
                      ":before": { borderBottom: 0 },
                      ":after": { borderBottom: 0 },
                      ":hover": {
                        backgroundColor: theme.vars.palette.grey[200],
                        ":before": { borderBottom: 0 },
                      },
                      ":has(:focus)": {
                        ":has(.Mui-error)": {
                          ".MuiInputAdornment-positionStart": {
                            color: theme.vars.palette.error.light,
                          },
                          "input::placeholder": {
                            color: theme.vars.palette.error.light,
                          },
                        },
                        ":not(.Mui-error)": {
                          borderColor: theme.palette.primary.main,
                          "&.MuiPickersInputBase-adornedStart": {
                            color: theme.palette.primary.main,
                          },
                        },
                      },
                      ".MuiPickersSectionList-root": {
                        fontSize: 15,
                        marginTop: -0.6,
                      },
                    },
                    theme.applyStyles("dark", {
                      backgroundColor: "rgba(43, 43, 43, 0.95)",
                      border: `1px solid ${theme.vars.palette.action.disabledBackground}`,
                      ":hover": {
                        backgroundColor: "rgba(43, 43, 43, 0.4)",
                      },
                      "&.Mui-error": {
                        backgroundColor: theme.vars.palette.error.main,
                        outline: `1px solid ${theme.vars.palette.error.light}`,
                        ":hover": {
                          //backgroundColor: theme.vars.palette.error?.hover,
                        },
                        ".MuiInputAdornment-positionStart": {
                          color: theme.vars.palette.error.light,
                        },
                        "input::placeholder": {
                          color: theme.vars.palette.error.light,
                        },
                      },
                    }),
                  ],
                  "&.MuiFormHelperText-root": [
                    {
                      color: "#ff7ba5", //props.theme.vars.palette.error.dark,
                      fontSize: 11,
                      fontWeight: 600,
                      marginTop: 0.1,
                      marginRight: -1,
                      marginBottom: -14,
                      textAlign: "right",
                    },
                    theme.applyStyles("dark", {
                      color: theme.vars.palette.error.light,
                    }),
                  ],
                }),
              },
            },
          }}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          yearsOrder="desc"
        />
      </LocalizationProvider>
    </Grid>
  );
}
