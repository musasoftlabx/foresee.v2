// * NPM
import { create } from "zustand";

interface useToastStore {
  open?: boolean;
  isLoading?: boolean;
  duration?: number | null;
  status?: "success" | "info" | "warning" | "error";
  subject?: string;
  message?: string;
  onClose: () => void;
  setSnackBar: ({
    open,
    status,
    subject,
    message,
    isLoading,
    duration,
    onClose,
  }: {
    open?: boolean;
    isLoading?: boolean;
    duration?: number;
    status?: "success" | "info" | "warning" | "error";
    subject?: string;
    message?: string;
    onClose?: () => void;
  }) => void;
}

export const useToastStore = create<useToastStore>((set) => ({
  open: false,
  isLoading: false,
  duration: null,
  status: "success",
  subject: "",
  message: "",
  onClose: () => {},
  setSnackBar: ({
    open,
    status,
    subject,
    message,
    isLoading,
    duration,
    onClose,
  }) =>
    set((state) => ({
      ...state,
      open: open === undefined || open === true ? true : false,
      isLoading,
      duration,
      status: !status ? state.status : status,
      subject,
      message,
      onClose: onClose ? onClose : () => state.onClose,
    })),
}));
