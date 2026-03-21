// * NPM
import { create } from "zustand";

// * MUI
import type { PaletteMode, ThemeOptions } from "@mui/material";

type ThemeStore = {
  theme: ThemeOptions;
  changeMode: (mode: PaletteMode) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: {
    cssVariables: { nativeColor: true },
    palette: {
      DataGrid: { bg: "var(--sidebar)" },
      background: { paper: "var(--sidebar)", paperChannel: undefined },
      divider: "var(--foreground)",
      dividerChannel: undefined,
      primary: { main: "var(--primary)" },
    },
  },
  changeMode: (mode: PaletteMode) =>
    set(
      (state): Partial<ThemeStore> => ({
        ...state,
        theme: {
          ...state.theme,
          palette: { ...state.theme.palette, mode },
        },
      }),
    ),
}));
