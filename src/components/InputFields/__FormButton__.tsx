// * HUI
import { Button } from "@heroui/react";
import type { ButtonProps } from "@heroui/react";

// * MUI
import { Grid } from "@mui/material";

type TButton = {
  /**
   * @param {boolean} isDisabled - Button disabled state.
   * @see https://ui.musasoftlabs.com/docs/__FormButton__#isDisabled
   * @author Musa Mutetwi Muliro &lt;musasoftlabx&commat;gmail.com&gt;
   */
  isDisabled?: boolean;
  /**
   * @param {boolean} isLoading - Button loading state.
   * @see https://ui.musasoftlabs.com/docs/__FormButton__#isLoading
   * @author Musa Mutetwi Muliro &lt;musasoftlabx&commat;gmail.com&gt;
   */
  isLoading?: boolean;
  loadingText?: string;
  /**
   * Where to align the button horizontally.
   * @see https://ui.musasoftlabs.com/docs/__FormButton__#placement
   * @author Musa Mutetwi Muliro &lt;musasoftlabx&commat;gmail.com&gt;
   */
  placement?: "left" | "center" | "right";
} & ButtonProps;

export default function __FormButton__(props: TButton) {
  return (
    <Grid
      size={12}
      display="flex"
      justifyContent={props.placement || "center"}
      px={1}
      pt={1}
      overflow="hidden"
    >
      <Button type="submit" {...props} />
    </Grid>
  );
}
