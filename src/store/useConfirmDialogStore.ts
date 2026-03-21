// * NPM
import { ReactNode } from "react";
import { create } from "zustand";

interface ConfirmDialogStore {
  isOpen: boolean;
  icon?: ReactNode;
  status: "success" | "info" | "warning" | "error";
  action?: string;
  subject: string;
  body: string;
  confirm: ({
    icon,
    status,
    action,
    subject,
    body,
  }: {
    icon?: ReactNode;
    status?: "success" | "info" | "warning" | "error";
    action?: string;
    subject: string;
    body: string;
  }) => void;
  // cancel?: string;
  // ok?: string;
  // operation: string;
  close: () => void;
}

export const useConfirmDialogStore = create<ConfirmDialogStore>((set) => ({
  isOpen: false,
  icon: "",
  status: "error",
  subject: "",
  body: "",
  okText: "YES",
  cancelText: "NO",
  confirm: ({ icon, status, action, subject, body }) =>
    set((state) => ({
      ...state,
      isOpen: !state.isOpen,
      status: !status ? state.status : status,
      action,
      icon,
      subject,
      body,
      okText: "YES",
      cancelText: "NO",
    })),
  close: () => set((state) => ({ ...state, isOpen: false })),
}));
