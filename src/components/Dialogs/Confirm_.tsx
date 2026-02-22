import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// * React Icons imports
import { FcSignature } from "react-icons/fc";
import { BsPatchCheck } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { FaServer } from "react-icons/fa";

import { AnimatePresence, motion } from "framer-motion";
import parse from "html-react-parser";

import { TextFieldX } from "../InputFields/TextFieldX";

import styles from "@/styles/Alert.module.css";
import { useDialogStore } from "@/store/useDialogStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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

export default function Confirm({
  theme,
  okText = "OK",
  cancelText = "CANCEL",
  comments,
  handleConfirm,
  handleCancel,
}: {
  theme?: any;
  okText?: string;
  cancelText?: string;
  comments?: string;
  handleConfirm: () => void;
  handleCancel?: () => void;
}) {
  const status = useDialogStore((state) => state.status);
  const subject = useDialogStore((state) => state.subject);
  const body = useDialogStore((state) => state.body);

  const [comment, setComment] = useState("");

  const { mutate } = useMutation({
    mutationFn: (body) => axios.put("tickets/comments", body),
  });

  const style = {
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
        return <FaServer style={{ color: "#fff", fontSize: "36px" }} />;
      default:
        return <BsPatchCheck style={{ color: "#fff", fontSize: "36px" }} />;
    }
  };

  return (
    <AnimatePresence>
      <Modal open={useDialogStore((state) => state.isOpen)}>
        <motion.div
          initial={{ opacity: 0, y: "0%" }}
          animate={{ opacity: 1, y: "calc(50vh)" }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          exit={{ opacity: 0, y: 100 }}
        >
          <Box
            sx={(theme) => ({
              ...style,
              backgroundColor: theme.palette.background.paper || "#fff",
            })}
          >
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
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <Icon />

              <Typography
                sx={{ color: "#fff", fontWeight: "bold" }}
                variant="h6"
              >
                {subject}
              </Typography>

              <Typography sx={{ pt: 9 }} variant="body2">
                {parse(body ?? "")}
              </Typography>

              {comments && (
                <TextFieldX
                  label="Rationale"
                  multiline
                  rows={3}
                  prefixcon={<FcSignature size={24} />}
                  helperText={`${comment.length} chars`}
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  style={{ marginBottom: 10 }}
                />
              )}
            </Stack>
            <Stack direction="row" justifyContent="flex-end">
              <Button onClick={handleCancel}>{cancelText}</Button>
              <Button
                onClick={() => {
                  //@ts-ignore
                  comments && mutate({ _: comments, comment });
                  handleConfirm();
                }}
                autoFocus
                color={status}
              >
                {okText}
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </Modal>
    </AnimatePresence>
  );
}
