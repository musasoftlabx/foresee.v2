// * MUI
import {
  Button,
  ButtonProps,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/material";

type ButtonX = {
  /**
   * @param {boolean} scaleOnHover - Scales the button when hovered
   * @see https://ui.musasoftlabs.com/docs/ButtonX#dontScale
   * @author Musa Mutetwi Muliro &lt;musasoftlabx&commat;gmail.com&gt;
   */
  loadingtext?: string;
  /**
   * Where to align the button horizontally.
   * @see https://ui.musasoftlabs.com/docs/ButtonX#placement
   * @author Musa Mutetwi Muliro &lt;musasoftlabx&commat;gmail.com&gt;
   */
  placement?: "left" | "center" | "right";
} & ButtonProps;

export default function ButtonX(props: ButtonX) {
  return (
    <Grid
      size={12}
      display="flex"
      justifyContent={props.placement || "center"}
      px={1}
      pt={1}
      overflow="hidden"
    >
      {/* <motion.div
        whileHover={
          !props.disabled && props.scaleOnHover ? { scale: 1.05 } : {}
        }
        transition={{ type: "spring", stiffness: 500, damping: 10 }}
      > */}
      <Button
        {...props}
        type="submit"
        variant={props?.variant || "outlined"}
        loadingIndicator={
          <Stack spacing={1} direction="row">
            <Typography variant="subtitle2" noWrap>
              {props.loadingtext}
            </Typography>
            <CircularProgress size={20} color="inherit" />
          </Stack>
        }
        sx={(theme) => ({
          ...props.sx,
          borderRadius: 2,
          border: props.disabled
            ? `2px solid ${theme.vars.palette.action.hover}`
            : `2px solid ${theme.vars.palette.primary.dark}`,
          padding: "3px 16px",
          pt: 0.55,
          pb: 0.6,
          //boxShadow: "rgba(52, 117, 210, 0.3) 0px 30px 90px",
          ":hover": {
            border: `2px solid ${theme.vars.palette.primary.light}`,
            //borderStyle: "double",
            //boxShadow: "rgba(2, 87, 210, 0.5) 0px 30px 90px",
          },
        })}
      >
        {props.children}
      </Button>
      {/* </motion.div> */}
    </Grid>
  );
}
