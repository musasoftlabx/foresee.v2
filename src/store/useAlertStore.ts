// * NPM
import { create } from "zustand";

interface useAlertStore {
  isOpen: boolean;
  status: "success" | "info" | "warning" | "error";
  error: string;
  message: string;
  alert: ({
    status,
    operation,
    error,
    message,
  }: {
    status: "success" | "info" | "warning" | "error";
    operation?: string;
    error: string;
    message: string;
  }) => void;
}

export const useAlertStore = create<useAlertStore>((set) => ({
  isOpen: false,
  status: "warning",
  error: "",
  message: "",
  alert: ({ status, error, message }) =>
    set((state) => ({
      ...state,
      isOpen: !state.isOpen,
      status: !status ? state.status : status,
      error,
      message,
    })),
}));
