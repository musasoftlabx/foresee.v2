// * MUI
import Box from "@mui/material/Box";

// * Components
import EmptyRecords from "./EmptyRecords";

export default function DataGridNoRowsOverlay() {
  return (
    <>
      <Box
        sx={{
          bgcolor: "background.default",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          height: "inherit",
          width: "inherit",
          zIndex: -1,
        }}
      />
      <EmptyRecords entity="Records" />
    </>
  );
}
