// * MUI
import {
  Button,
  ButtonProps,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/material";
import { useState } from "react";

// * NPM
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { TextFieldX } from "./TextFieldX";

interface iButtonX {
  children?: React.ReactNode;
  dontscale?: boolean;
  disabled?: boolean;
  placement?: string;
  loadingtext?: string;
  sx?: {};
  variant?: ButtonProps["variant"];
  loading?: ButtonProps["loading"];
  fullwidth?: ButtonProps["fullWidth"];
  size?: ButtonProps["size"];
  onClick?: () => void;
}

export default function PhoneNumberX(props: iButtonX) {
  const [phone, setPhone] = useState();

  return (
    <PhoneInput
      placeholder="Enter phone number"
      value={phone}
      onChange={setPhone}
      defaultCountry="KE"
    />
  );
}
