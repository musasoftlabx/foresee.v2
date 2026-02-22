// * MUI
import {
  Alert,
  AlertTitle,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

// * Store
import { useToastStore } from "@/store/useToastStore";

// * Icons
import { BsCheck2Circle } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import { TbFaceIdError, TbInfoHexagon } from "react-icons/tb";

export default function Toast() {
  const open = useToastStore((state) => state.open);
  const isLoading = useToastStore((state) => state.isLoading);
  const status = useToastStore((state) => state.status);
  const subject = useToastStore((state) => state.subject);
  const message = useToastStore((state) => state.message);
  const duration = useToastStore((state) => state.duration);
  const onClose = useToastStore((state) => state.onClose);
  const setSnackBar = useToastStore((state) => state.setSnackBar);

  return (
    <Snackbar
      open={open}
      autoHideDuration={isLoading ? null : duration}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      onClose={() => {
        onClose();
        setSnackBar({ open: false });
      }}
    >
      {isLoading ? (
        <Alert variant="filled" severity="info" icon={false}>
          <Stack direction="row" spacing={1}>
            <CircularProgress size={20} sx={{ color: "#fff" }} />
            <Typography variant="body2" sx={{ color: "#fff" }}>
              {message}
            </Typography>
          </Stack>
        </Alert>
      ) : (
        <Alert
          variant="filled"
          severity={status}
          iconMapping={{
            success: <BsCheck2Circle color="white" />,
            info: <TbInfoHexagon color="white" />,
            warning: <IoWarningOutline color="white" />,
            error: <TbFaceIdError color="white" />,
          }}
          sx={{ borderRadius: 3 }}
        >
          {subject && <AlertTitle color="white">{subject}</AlertTitle>}
          <Typography variant="body2" sx={{ color: "#fff" }}>
            {message}
          </Typography>
        </Alert>
      )}
    </Snackbar>
  );
}
