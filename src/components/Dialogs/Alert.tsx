import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { BsPatchCheck } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { FaServer } from "react-icons/fa";

import { AnimatePresence, motion } from "framer-motion";
import parse from "html-react-parser";

import styles from "@/styles/Alert.module.css";
import { useAlertStore } from "@/store/useAlertStore";
import { Paper } from "@mui/material";

interface Gradients {
  success: [string, string];
  info: [string, string];
  warning: [string, string];
  error: [string, string];
}

const gradients: Gradients = {
  success: ["#00b09b", "#96c93d"],
  info: ["#fc00ff", "#00dbde"],
  warning: ["#f12711", "#f5af19"],
  error: ["#93291E", "#ED213A"],
};

export default function Alert({ theme }: { theme: any }) {
  const handleClose: any = useAlertStore((state) => state.alert);
  const status = useAlertStore((state) => state.status);
  const error = useAlertStore((state) => state.error);
  const message = useAlertStore((state) => state.message);

  const style = {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "20px",
    borderTop: `1px solid ${gradients[status][1]}`,
    left: "50%",
    maxWidth: "300px",
    overflow: "hidden",
    px: 3,
    pt: 3,
    pb: 2,
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    zIndex: "9999",
  };

  const Icon = () => {
    switch (status) {
      case "info":
        return (
          <HiOutlineInformationCircle
            style={{ color: "#fff", fontSize: "36px" }}
          />
        );
      case "warning":
        return <IoWarningOutline style={{ color: "#fff", fontSize: "36px" }} />;
      case "error":
        return (
          <FaServer
            style={{
              color: theme.palette.error.dark,
              fontSize: 25,
              textAlign: "center",
            }}
          />
        );
      default:
        return <BsPatchCheck style={{ color: "#fff", fontSize: "36px" }} />;
    }
  };

  return (
    <AnimatePresence>
      <Modal open={useAlertStore((state) => state.isOpen)}>
        <motion.div
          initial={{ opacity: 0, y: "0%" }}
          animate={{ opacity: 1, y: "calc(50vh)" }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          exit={{ opacity: 0, y: 100 }}
        >
          <Box sx={style}>
            <div className={styles.dividerTop}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="MyGradient">
                    <stop offset="0%" stopColor={gradients[status][1]}></stop>
                    <stop offset="100%" stopColor={gradients[status][0]}></stop>
                  </linearGradient>
                </defs>
                <path
                  className={styles.dividerFill}
                  d="M0,33.886L13.281,0L62.225,67.779L88.288,45.436L140,3.886L100,100L0,100L0,33.886z"
                  style={{ fillOpacity: 0.2 }}
                />
                <path
                  className={styles.dividerFill}
                  //d="M0,48.8L10.938,44.6L35.196,65.112L62.225,47L89.063,68.844L100,64.8L100,100L0,100L0,64.8z"
                  d="M0,53.8L20.938,44.6L20,55.112L54.225,57L399.063,0.844L100,64.8L100,100L0,100L0,64.8z"
                />
              </svg>
            </div>
            <Stack
              alignItems="center"
              direction="column"
              justifyContent="center"
              mt={-1}
            >
              <Box
                alignItems="center"
                border="5px double red !important"
                display="flex"
                justifyContent="center"
                borderRadius={100}
                height={60}
                width={60}
                sx={{ bgcolor: "background.default" }}
              >
                <Icon />
              </Box>

              <Typography color="white" fontFamily="Pacifico" fontSize={25}>
                {error}
              </Typography>
            </Stack>

            <Typography variant="body2" pt={7}>
              {parse(message ?? "")}
            </Typography>

            <Stack direction="row" justifyContent="flex-end">
              <Button autoFocus color={status} onClick={handleClose}>
                OK
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </Modal>
    </AnimatePresence>
  );
}
