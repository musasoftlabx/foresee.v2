// * MUI
import Box from "@mui/material/Box";

// * Components
import Loader from "@/components/Shared/Loader";

export default function DataGridLoadingOverlay() {
  return (
    <>
      <Box
        sx={{
          bgcolor: "divider",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          height: "inherit",
          width: "inherit",
        }}
      />
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          height: "70vh",
          justifyContent: "center",
        }}
      >
        <Loader text="Fetching records..." />
      </Box>
    </>
  );
}
