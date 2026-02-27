// * NPM
import {
  FieldNamesMarkedBoolean,
  FieldValues,
  SetFieldValue,
} from "react-hook-form";
import dayjs from "dayjs";

// * MUI
import {
  DatePickerFieldProps,
  DateTimePicker,
  DateTimePickerProps,
  LocalizationProvider,
  renderTimeViewClock,
  useParsedFormat,
  usePickerContext,
  useSplitFieldProps,
  useValidation,
  validateDateTime,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Grid, useForkRef } from "@mui/material";

// * HUI
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

// * Icons
import { HiOutlineCalendarDateRange } from "react-icons/hi2";

export default function __DatePicker__(
  props: DateTimePickerProps & {
    columnspan?: {};
    field: string;
    variant?: "flat" | "faded" | "bordered" | "underlined";
    helperText?: string;
    label: string;
    dirty: Partial<Readonly<FieldNamesMarkedBoolean<FieldValues>>>;
    setValue: SetFieldValue<FieldValues>;
  },
) {
  const { columnspan, field, variant, helperText, label, setValue } = props;

  return (
    <Grid size={columnspan}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          {...props}
          enableAccessibleFieldDOMStructure={false}
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
            field: (prop: DatePickerFieldProps) => {
              const { internalProps, forwardedProps } = useSplitFieldProps(
                prop,
                "date",
              );
              const parsedFormat = useParsedFormat();
              const pickerContext = usePickerContext();
              const handleRef = useForkRef(
                pickerContext.triggerRef,
                pickerContext.rootRef,
              );
              const { hasValidationError } = useValidation({
                validator: validateDateTime,
                value: pickerContext.value,
                timezone: pickerContext.timezone,
                props: internalProps,
              });

              return (
                <Input
                  {...forwardedProps}
                  ref={handleRef}
                  isRequired
                  isReadOnly
                  variant={variant ?? "faded"}
                  label={label}
                  description={helperText}
                  placeholder={parsedFormat}
                  disabled={props.disabled}
                  errorMessage={hasValidationError && `Enter a valid date`}
                  isInvalid={hasValidationError}
                  size="sm"
                  endContent={
                    !props.disabled && (
                      <Button
                        isIconOnly
                        variant="light"
                        radius="full"
                        className="top-0.5 -right-2.5"
                        onPress={() => pickerContext.setOpen((prev) => !prev)}
                      >
                        <HiOutlineCalendarDateRange className="text-xl" />
                      </Button>
                    )
                  }
                  value={
                    pickerContext.value == null
                      ? ""
                      : pickerContext.value.format(pickerContext.fieldFormat)
                  }
                  color={
                    props.dirty[field]
                      ? "success"
                      : hasValidationError
                        ? "danger"
                        : "default"
                  }
                />
              );
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
