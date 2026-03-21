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
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { TooltipProvider } from "@/components/ui/shadcn/tooltip";
import { getCookie } from "cookies-next";
import axios from "axios";

// * Store
import { useThemeStore } from "@/store/useThemeStore";

// * Components
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";
import AlertDialog from "@/components/alert-dialog";

type Props = Readonly<{
  children: React.ReactNode;
}>;

// * Axios config
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
axios.defaults.timeout = 60000;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post.Accept = "application/json";
axios.interceptors.request.use(
  (req) => {
    req.headers.Authorization = `Bearer ${getCookie("__foresee_aT")}`;
    return req;
  },
  (err) => Promise.reject(err),
);

// * Initialize Query Client
const queryClient = new QueryClient();

export function NextThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default function QueryProvider({ children }: Props) {
  const router = useRouter();
  const themeState = useThemeStore((state) => state.theme);
  const changeMode = useThemeStore((state) => state.changeMode);
  const theme = useMemo(() => createTheme(themeState), [themeState]);

  const isSystemDark =
    window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark")
      changeMode(storedTheme);
    else if (storedTheme === "system")
      changeMode(isSystemDark ? "dark" : "light");
  }, []);

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
            <SidebarProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </SidebarProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </HeroUIProvider>
    </NextThemeProvider>
  );
}
