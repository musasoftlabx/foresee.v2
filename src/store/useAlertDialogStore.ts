// * React
import { ReactNode } from "react";

// * NPM
import { create } from "zustand";

interface AlertDialogStore {
  isOpen?: boolean;
  icon: ReactNode;
  status: "success" | "info" | "warning" | "error";
  subject: string;
  body: string;
  alert: ({
    icon,
    status,
    subject,
    body,
  }: {
    icon?: ReactNode;
    status?: "success" | "info" | "warning" | "error";
    subject: string;
    body: string;
  }) => void;
  close: () => void;
}

export const useAlertDialogStore = create<AlertDialogStore>((set) => ({
  isOpen: false,
  icon: "",
  status: "warning",
  subject: "",
  body: "",
  alert: ({ icon, status, subject, body }) =>
    set((state) => ({
      ...state,
      isOpen: !state.isOpen,
      icon,
      status: !status ? state.status : status,
      subject,
      body,
    })),
  close: () => set((state) => ({ ...state, isOpen: false })),
}));
