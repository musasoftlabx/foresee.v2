// * Next
import Image from "next/image";

// * MUI
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

// * Assets
//import loading from "/images/illustrations/animated/loading.gif";

export default function Loader({ text }: { text: string }) {
  return (
    <Grid container alignItems="center" flexDirection="column">
      <Image
        src="/images/illustrations/animated/loading.gif"
        alt="loading"
        priority
        height={150}
        width={150}
      />
      <Typography variant="h5">{text}</Typography>
    </Grid>
  );
}
