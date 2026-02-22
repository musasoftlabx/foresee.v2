// * NPM
import { create } from "zustand";

interface useDialogStore {
  isOpen: boolean;
  status: "success" | "info" | "warning" | "error";
  subject: string;
  body: string;
  confirm: ({
    status,
    operation,
    subject,
    body,
  }: {
    status: "success" | "info" | "warning" | "error";
    operation?: string;
    subject: string;
    body: string;
  }) => void;
  // cancel?: string;
  // ok?: string;
  // operation: string;
  close: () => void;
}

export const useDialogStore = create<useDialogStore>((set) => ({
  isOpen: false,
  status: "warning",
  subject: "",
  body: "",
  confirm: ({ status, subject, body }) =>
    set((state) => ({
      ...state,
      isOpen: !state.isOpen,
      status: !status ? state.status : status,
      subject,
      body,
    })),
  close: () => set((state) => ({ ...state, isOpen: false })),
}));
