// * Next
import { useRouter } from "next/navigation";
import Image from "next/image";

// * MUI
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const EmptyRecords = ({ entity }: { entity: string }) => {
  const router = useRouter();

  return (
    <Grid
      display="flex"
      size={12}
      sx={{ flexDirection: "column", height: "70vh", justifyContent: "center" }}
    >
      <Box
        sx={{ alignItems: "center", display: "flex", flexDirection: "column" }}
      >
        <Image
          src="/images/illustrations/animated/no-records.gif"
          alt="no-records"
          priority
          width={200}
          height={200}
        />
        <Typography variant="h6" sx={{ opacity: 0.8 }}>
          {entity} not found
        </Typography>
        <Button
          variant="contained"
          sx={{ borderRadius: 3, mt: 2 }}
          onClick={() => router.reload()}
        >
          RELOAD
        </Button>
      </Box>
    </Grid>
  );
};

export default EmptyRecords;
