// * React
import { forwardRef } from "react";

// * MUI
import { styled, ThemeOptions } from "@mui/material/styles";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { OutlinedInputProps } from "@mui/material/OutlinedInput";
import { Grid, LinearProgress } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, { TextFieldProps } from "@mui/material/TextField";

// * NPM
import { useMask } from "@react-input/mask";

// * Types
type TExtendedProps = TextFieldProps & {
  children?: React.ReactNode;
  theme?: any;
  ref?: any;
  label: string;
  select?: boolean;
  error?: boolean;
  multiline?: boolean;
  loading?: boolean;
  mask?: string;
  rows?: number;
  helperText?: string | boolean;
  prefixcon?: React.ReactNode;
  suffixcon?: React.ReactNode;
  slotprops?: any;
  replacement?: { x?: RegExp; $?: RegExp; _?: RegExp };
  type?: string;
  columnspan?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  placeholder?: string;
  circularedge?: number;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// * Create styled elements
const StyledTextField = styled(
  forwardRef((props: TExtendedProps, ref) => (
    <Grid size={props?.columnspan}>
      <TextField
        {...props}
        inputRef={ref}
        variant="filled"
        fullWidth
        size="small"
        placeholder={props.placeholder || props.label}
        slotProps={{
          ...props.slotprops,
          input: {
            ...props.slotprops?.input,
            startAdornment: props.prefixcon && (
              <InputAdornment
                position="start"
                sx={{
                  marginTop: props.multiline
                    ? props.value
                      ? `${props.rows! * -18}px !important`
                      : `${props.rows! * -22}px !important`
                    : props.value
                      ? "12px !important"
                      : typeof props.prefixcon === "string" &&
                          props.value == "0"
                        ? "17px !important"
                        : "0px !important",
                  color: props.error ? "#d3302f" : "",
                }}
              >
                {props.prefixcon as string}
              </InputAdornment>
            ),
            endAdornment: props.suffixcon && (
              <InputAdornment position="end">
                {props.suffixcon as string}
              </InputAdornment>
            ),
          } as Partial<OutlinedInputProps>,
          select: props.select
            ? {
                MenuProps: {
                  sx: {
                    top: props.error ? 3 : 2,
                    ".MuiMenu-paper": {
                      //width: "250px",
                      borderBottomLeftRadius: 15,
                      borderBottomRightRadius: 15,
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                      boxShadow: "rgba(0, 0, 0, 0.4) 0px 30px 90px;",
                      //left: "23.2% !important",
                    },
                    ".MuiMenuItem-root": {
                      fontSize: 14,
                      my: 0.4,
                      ":hover": (theme) => ({
                        ":not(.Mui-selected)": {
                          background: "#9c27b033", //`${theme.vars.palette.primary.main}80`,
                          //background: `${theme.vars.palette.primary.main} / 33`,
                          //background: `var(--mui-palette-primary-main-500)`,
                          border: `1px solid ${theme.vars.palette.primary.main}`,
                          borderRadius: 2,
                          mx: 2,
                          transform: "scale(1.05)",
                          transition:
                            "background 0.5s ease-out, transform 0.3s ease-out",
                        },
                      }),
                    },
                    ".Mui-selected": {
                      background: "rgba(71, 101, 130, 0.3)",
                      borderRadius: 2,
                      fontWeight: "bold",
                      mx: 1,
                      pointerEvents: "none",
                      opacity: 0.5,
                    },
                  },
                },
              }
            : {},
        }}
      />
      {props.loading && <LinearProgress sx={{ height: 3, mt: -0.2 }} />}
    </Grid>
  ))
)((props) => ({
  // ? Prevents MUI blue autofill background
  "& :-webkit-autofill": { transitionDelay: "9999s" },
  // ? Label if error
  "label.Mui-error": [
    ({ theme }: { theme: any }) => ({
      color: theme.vars.palette.error.dark,
    }),
    ({ theme }: { theme: any }) =>
      theme.applyStyles("dark", {
        color: theme.vars.palette.error.light,
      }),
  ],
  // ? Helper text
  ".MuiFormHelperText-root": [
    {
      color: props.error ? "#ff7ba5" : "", //props.theme.vars.palette.error.dark,
      fontSize: 11,
      fontWeight: 600,
      marginTop: 2,
      marginRight: -1,
      marginBottom: -14,
      textAlign: "right",
    },
    ({ theme }: { theme: any }) =>
      theme.applyStyles("dark", {
        color: props.error ? theme.vars.palette.error.light : "",
      }),
  ],
  // ? Text input container
  ".MuiFilledInput-root": [
    ({ theme }: { theme: any }) => ({
      backgroundColor: theme.vars.palette.grey[100],
      border: `1px solid ${theme.vars.palette.grey[300]}`,
      borderRadius: props.circularedge || 6,
      borderBottomLeftRadius: props.loading ? 0 : props.circularedge || 6,
      borderBottomRightRadius: props.loading ? 0 : props.circularedge || 6,
      ":before": { borderBottom: 0 },
      ":after": { borderBottom: 0 },
      ":hover": { backgroundColor: theme.vars.palette.grey[200] },
      "&.Mui-error": {
        backgroundColor: theme.vars.palette.error.main,
        outline: "1px solid #ff7ba5", //`1px solid ${props.theme.vars.palette.error.dark}`,
        ":hover": { backgroundColor: theme.vars.palette.error.hover },
        ".MuiInputAdornment-positionStart": {
          color: theme.vars.palette.error.dark,
        },
        "input::placeholder": { color: theme.vars.palette.error.dark },
      },
    }),
    ({ theme }: { theme: any }) =>
      theme.applyStyles("dark", {
        backgroundColor: "rgba(43, 43, 43, 0.95)",
        border: `1px solid ${theme.vars.palette.action.disabledBackground}`,
        ":hover": { backgroundColor: "rgba(43, 43, 43, 0.4)" },
        "&.Mui-error": {
          backgroundColor: theme.vars.palette.error.main,
          outline: `1px solid ${props.theme.vars.palette.error.light}`,
          ":hover": { backgroundColor: theme.vars.palette.error.hover },
          ".MuiInputAdornment-positionStart": {
            color: theme.vars.palette.error.light,
          },
          "input::placeholder": { color: theme.vars.palette.error.light },
        },
      }),
  ],
  // ? Text input label
  ".MuiFormLabel-root": {
    fontSize: 14,
    top: 2,
    pointerEvents: "none",
    right: props.prefixcon ? 75 : 35,
    transform: `translate(${
      props.prefixcon ? (typeof props.prefixcon === "string" ? 51 : 45) : 13
    }px, 12px) scale(1.05)`,
    "&.Mui-focused": {
      fontSize: props.select ? 14 : 16,
      opacity: props.select ? 1 : 0,
    },
    // ? Transalted form label (Small one on the top when input has value)
    "&.MuiFormLabel-filled": {
      fontSize: 16,
      opacity: 1,
      transform: "translate(14px, 1px) scale(0.7)",
    },
  },
  // ? Remove bottom width on hover
  ".MuiInputBase-adornedStart": {
    ":before": { content: "unset" },
    ":after": { content: "unset" },
  },

  "&.MuiFormControl-root": {
    ".MuiInputBase-root:has(input:autofill)": {
      paddingTop: 4,
      color: props.theme.vars.palette.grey[900],
      ".MuiInputAdornment-positionStart": { marginTop: "13px" },
    },
    ".MuiInputBase-root:has(:focus)": {
      ":has(.Mui-error)": {
        ".MuiInputAdornment-positionStart": {
          color: props.theme.vars.palette.error.light,
        },
        "input::placeholder": { color: props.theme.vars.palette.error.light },
      },
      ":not(.Mui-error)": {
        borderColor: props.theme.palette.primary.main,
        ".MuiInputAdornment-positionStart": {
          color: props.theme.palette.primary.main,
        },
        "input::placeholder": { color: props.theme.palette.primary.main },
      },
    },
    input: {
      "&[value='']": { marginTop: -10.5, paddingBottom: 10 },
      "&:not([value=''])": { marginTop: -5, paddingBottom: 4 },
      "&:not([value])": { marginTop: -2.5 },
      "&:focus": {
        "&:not([value])": { fontSize: 15, marginTop: -8, paddingBottom: 12 },
        "::placeholder": {
          fontSize: 15,
          marginTop: "-18px !important",
          opacity: 1,
        },
      },
      "&:not(focus)": {
        ":autofill, ::placeholder": {
          //marginBottom: "-2px !important",
          marginTop: "20px !important",
          marginBottom: "10px !important",
          //background: "transparent !important",
          opacity: 0.5,
          visibility: "visible",
        },
      },
      "::placeholder, ::-moz-placeholder": { fontSize: 0 },
    },
    textarea: {
      ":not(focus)::placeholder": { visibility: "hidden" },
      ":focus": {
        "::placeholder": { visibility: "visible" },
        ":empty": { fontSize: 15, marginTop: -8, paddingBottom: 12 },
      },
    },
  },
  // ? Select container
  ".MuiSelect-filled": { paddingTop: 16, paddingBottom: 6 },
}));

export const __TextField__ = (props: TExtendedProps) =>
  props.mask ? (
    <StyledTextField
      {...props}
      ref={useMask({ mask: props.mask, replacement: props.replacement })}
    />
  ) : (
    <StyledTextField {...props} />
  );
