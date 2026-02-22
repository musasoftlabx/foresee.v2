// * Material UI imports
import { styled } from "@mui/material/styles";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

// * React Icons imports
import { RiCloseFill } from "react-icons/ri";

// * Type definitions
type TAdditionalIconButtonProps = IconButtonProps & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

// * Create styled elements
const CloseButton = styled(RiCloseFill)({
  fontSize: 25,
  background: "linear-gradient(to top, red 0%, red 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  transform: "rotate(90deg)",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "rotate(180deg)",
    transition: "transform 0.3s",
  },
});

export const CloseButtonX = (props: TAdditionalIconButtonProps) => (
  <IconButton {...props} edge="end">
    <CloseButton />
  </IconButton>
);
