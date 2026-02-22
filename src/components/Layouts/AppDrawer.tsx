"use client";

import {
  Box,
  Chip,
  createTheme,
  FormControlLabel,
  Menu,
  MenuItem,
  Paper,
  Stack,
  styled,
  Switch,
  Tooltip,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";
import { AppProvider, Navigation } from "@toolpad/core/AppProvider";
import { PageContainer } from "@toolpad/core/PageContainer";
import {
  DashboardLayout,
  SidebarFooterProps,
  ThemeSwitcher,
} from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { SwitchX } from "../InputFields/SwitchX";
import { useThemeStore } from "@/store/useThemeStore";
import ThemeSwitcherX from "../InputFields/ThemeSwitcherX";

// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import DescriptionIcon from '@mui/icons-material/Description';
// import LayersIcon from '@mui/icons-material/Layers';

export default function AppDrawer({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  const [popoverAnchorEl, setPopoverAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const isPopoverOpen = Boolean(popoverAnchorEl);
  const popoverId = isPopoverOpen ? "simple-popover" : undefined;

  const handlePopoverButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setPopoverAnchorEl(null);
  };

  const popoverMenuAction = (
    <Fragment>
      {/* <IconButton aria-describedby={popoverId} onClick={handlePopoverButtonClick}>
      <MoreHorizIcon />
    </IconButton> */}
      <Menu
        id={popoverId}
        open={isPopoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        disableAutoFocus
        disableAutoFocusItem
      >
        <MenuItem onClick={handlePopoverClose}>New call</MenuItem>
        <MenuItem onClick={handlePopoverClose}>Mark all as read</MenuItem>
      </Menu>
    </Fragment>
  );

  const MaterialUISwitch = styled(Switch)(({ theme }) => [
    {
      width: 62,
      height: 34,
      padding: 7,
      "& .MuiSwitch-switchBase": {
        margin: 1,
        padding: 0,
        transform: "translateX(6px)",
        "&.Mui-checked": {
          color: "#fff",
          transform: "translateX(22px)",
          "& .MuiSwitch-thumb:before": {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
              "#fff"
            )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
          },
          "& + .MuiSwitch-track": {
            opacity: 1,
            backgroundColor: "#fff",
          },
        },
      },
      "& .MuiSwitch-thumb": [
        {
          backgroundColor: "black",
          width: 32,
          height: 32,
          "&:before": {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
              "#fff"
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
          },
        },
        () => theme.applyStyles("dark", { backgroundColor: "orange" }),
      ],
      "& .MuiSwitch-track": [
        {
          opacity: 1,
          backgroundColor: "#8796A5",
          borderRadius: 20 / 2,
        },
        () => theme.applyStyles("dark", { backgroundColor: "#aab4be" }),
      ],
    },
  ]);

  const NAVIGATION: Navigation & { page?: React.ReactNode } = [
    {
      kind: "header",
      title: "Main items",
    },
    {
      segment: "dashboard",
      title: "Dashboard",
      action: popoverMenuAction,
      //icon: <DashboardIcon />,
    },
    {
      segment: "users",
      title: "Users",
      action: <Chip label={7} color="primary" size="small" />,
      //page: <Users theme={{}} />,
      //icon: <ShoppingCartIcon />,
    },
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: "Analytics",
    },
    {
      segment: "ballots",
      title: "Ballots",
      //icon: <BarChartIcon />,
      children: [
        {
          segment: "",
          title: "Ballots",
          //icon: <DescriptionIcon />,
        },
        {
          segment: "create",
          title: "Create New",
          //icon: <DescriptionIcon />,
        },
      ],
    },
    {
      segment: "integrations",
      title: "Integrations",
      //icon: <LayersIcon />,
    },
  ];

  //   router={router}
  //   authentication={AUTHENTICATION}
  //   session={session}

  return (
    <AppProvider
      navigation={NAVIGATION}
      //router={router}
      theme={theme}
      branding={{
        logo: <img src="/images/logo.webp" alt="MUI logo" />,
        title: "E-Ballot",
        homeUrl: "/",
      }}
      //window={demoWindow}
    >
      <DashboardLayout
        slots={{
          appTitle: () => {
            return (
              <Stack direction="row" alignItems="center" spacing={2}>
                {/* <img
                  src="/images/logo.webp"
                  alt="MUI logo"
                  style={{ height: 30, width: 30 }}
                /> */}

                {/* <Typography variant="h6" fontFamily="Pacifico" fontSize={30}>
                  E-Ballot
                </Typography> */}

                {/* <Chip size="small" label="BETA" color="info" /> */}
                {/* <Tooltip title="Connected to production">
                  <CheckCircleIcon color="success" fontSize="small" />
                </Tooltip> */}
              </Stack>
            );
          },
          toolbarActions: () => (
            <Stack direction="row" alignItems="center">
              <ThemeSwitcher />
              <ThemeSwitcherX />
            </Stack>
          ),
          sidebarFooter: ({ mini }: SidebarFooterProps) => {
            return (
              <Typography
                variant="caption"
                sx={{ m: 1, whiteSpace: "nowrap", overflow: "hidden" }}
              >
                {mini
                  ? "© MUI"
                  : `© ${new Date().getFullYear()} Made with love by MUI`}
              </Typography>
            );
          },
        }}
        sx={{ px: 2, py: 1 }}
      >
        {children}
      </DashboardLayout>
    </AppProvider>
  );
}
