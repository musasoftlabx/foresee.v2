"use client";

// Only if using TypeScript
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

// * React
import { useEffect, useMemo } from "react";

// * Next
import { useRouter } from "next/navigation";

// * NPM
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";

import axios from "axios";

// * Components
import Alert from "@/components/Dialogs/Alert";

// * Store
import { useThemeStore } from "@/store/useThemeStore";
import { getCookie } from "cookies-next";
import Confirm from "@/components/dialog";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/shadcn/sidebar";

type Props = Readonly<{
  children: React.ReactNode;
}>;

// * Axios config
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
axios.defaults.timeout = 60000;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";
axios.interceptors.request.use(
  (req: any) => {
    req.headers.Authorization = `Bearer ${getCookie("__e_ballot_aT")}`;
    return req;
  },
  (err) => Promise.reject(err),
);

const queryClient = new QueryClient();

export default function QueryProvider({ children }: Props) {
  const router = useRouter();
  const setTheme = useThemeStore((state) => state.changeMode);
  const themeState = useThemeStore((state) => state.theme);
  const theme = createTheme(themeState);
  //const theme = useMemo(() => createTheme(themeState), [themeState]);

  const { setMode, systemMode } = useColorScheme();

  useEffect(() => {
    const __theme = localStorage.getItem("__theme");

    if (__theme === "light" || __theme === "dark") setMode(__theme);
    else localStorage.setItem("__theme", (systemMode as string) ?? "light");
  }, []);

  return (
    <HeroUIProvider navigate={router.push}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <Alert theme={theme} /> */}
        <Confirm />
        <ToastProvider />
        <QueryClientProvider client={queryClient}>
          <SidebarProvider>{children}</SidebarProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
