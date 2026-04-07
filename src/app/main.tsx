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
import { createTheme, ThemeProvider } from "@mui/material";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { TooltipProvider } from "@/components/ui/shadcn/tooltip";
import { getCookie, setCookie } from "cookies-next";
import axios from "axios";

// * Store
import { useThemeStore } from "@/store/useThemeStore";

// * Components

import AlertDialog from "@/components/alert-dialog";
import { useAlertDialogStore } from "@/store/useAlertDialogStore";

// * Axios config
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
axios.defaults.timeout = 60000;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post.Accept = "application/json";
axios.interceptors.request.use(
  (req) => {
    req.headers.Authorization = `Bearer ${getCookie("_foresee_aT")}`;
    return req;
  },
  (err) => Promise.reject(err),
);

// * Initialize Query Client
const queryClient = new QueryClient();

// * Initialize Next Themes
export function NextThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default function QueryProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isSystemDark =
    window && (matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false);

  // ? Hooks
  const router = useRouter();
  const alert = useAlertDialogStore((state) => state.alert);
  const themeState = useThemeStore((state) => state.theme);
  const changeMode = useThemeStore((state) => state.changeMode);

  // ? Memo
  const theme = useMemo(() => createTheme(themeState), [themeState]);

  // ? Effects
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark")
      changeMode(storedTheme);
    else if (storedTheme === "system")
      changeMode(isSystemDark ? "dark" : "light");
  }, [isSystemDark, changeMode]);

  useEffect(() => {
    axios.interceptors.response.use(
      (res) => {
        res.data._foresee_aT && setCookie("_foresee_aT", res.data._foresee_aT);
        return res;
      },
      (err) => {
        if (err.code === "ERR_NETWORK") {
          alert({
            status: "error",
            subject: err.message,
            body: "We could not establish a connection to the server. Kindly ensure you are connected.",
          });
          return;
        }

        if (err.response.data.forceLogout) location.href = "/";
        return Promise.reject(err);
      },
    );
  }, [alert]);

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <HeroUIProvider navigate={router.push}>
        <ThemeProvider theme={theme}>
          <AlertDialog />
          <ToastProvider />
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              {/* <GoogleOAuthProvider clientId={process.env.GOOGLE_AUTH_TOKEN}> */}
              <GoogleOAuthProvider clientId="798128308427-iic9ufku4dbhhlv67vvv000oedhfvkf2.apps.googleusercontent.com">
                {children}
              </GoogleOAuthProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </HeroUIProvider>
    </NextThemeProvider>
  );
}
