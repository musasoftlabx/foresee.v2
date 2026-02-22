import { useAlertStore } from "@/store/useAlertStore";
import { AxiosError } from "axios";

export const handleAxiosError = (error: unknown) => {
  // ? State Actions
  const showAlert = useAlertStore((state) => state.alert);

  if (error instanceof AxiosError) {
    showAlert({
      status: "error",
      error: error.response?.data.error,
      message: error.response?.data.message,
    });
  }
};
