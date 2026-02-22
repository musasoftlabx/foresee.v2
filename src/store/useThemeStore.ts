// * NPM
import { create } from "zustand";
import axios from "axios";

import { ThemeOptions } from "@mui/material";

type useThemeStore = {
  theme: ThemeOptions;
  changeMode: (mode: string) => void;
  getter: () => void;
  changeColor: (color: string) => void;
  getFont: () => void;
  changeFont: (font: string) => void;
};

const defaultFont = "Nunito";
export const defaultPrimaryColor = "rgb(0, 196, 120)"; //"#00c478";
//const defaultPrimaryColor = "#9c27b0";

export const useThemeStore = create<useThemeStore>((set) => ({
  theme: {
    cssVariables: { colorSchemeSelector: "class" },
    colorSchemes: {
      dark: {
        //palette: { error: { main: "#4e021a", mainHover:'', light: "#4e021a", dark: "#fff" } },
        palette: {
          primary: {
            main: defaultPrimaryColor,
            light: "lightgreen",
            dark: "green",
          },
          error: {
            main: "rgba(78, 2, 26, 1)",
            hover: "rgba(78, 2, 26, .5)",
            light: "#f54b81", //"rgb(255, 121, 142)", //"#4e021a",
            dark: "#000",
            border: "#ff7ba5",
            darker: "rgb(125, 0, 40)",
          },
        },
      },
      light: {
        palette: {
          primary: {
            main: defaultPrimaryColor,
            light: "lightgreen",
            dark: "green",
          },
          error: {
            main: "#ffd0db", //"rgb(255, 192, 192)",
            hover: "#ffebf3",
            light: "#4e021a",
            dark: "#ab0036", //"#ffd0db",
            border: "#ff7ba5",
            darker: "rgb(125, 0, 40)",
          },
        },
      },
    },
    //cssVariables: true,
    // palette: {
    //   primary: { main: defaultPrimaryColor },
    //   secondary: { main: "#edf2ff" },
    //   error: {
    //     main: "rgba(255, 255, 235, 0.95)",
    //     light: "#4e021a",
    //     dark: "#fff",
    //   },
    //   white: { main: "#fff", light: "#fff", dark: "#ef6c00" }, //contrastText: "rgba(0, 0, 0, 0.87)",
    //   black: { main: "#000", light: "#000", dark: "#fff" },
    // },
    typography: { fontFamily: defaultFont },
    // components: {
    //   MuiCssBaseline: {
    //     styleOverrides: {
    //       ["@font-face"]: {
    //         fontFamily: "Futura",
    //         src: "url(/fonts/futura.ttf)",
    //       },
    //       body: {
    //         ":autofill": {
    //           "::placeholder": { visibility: "hidden", fontSize: 0 },
    //         },
    //         ":-webkit-autofill": {
    //           "::placeholder": { visibility: "hidden", fontSize: 0 },
    //         },
    //         //scrollbarColor: "#6b6b6b #2b2b2b",
    //         // TODO: To remove ::-webkit-scrollbar after sometime since CSS now supports scrollbar styling
    //         "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
    //           //backgroundColor: "#e7e7e7",
    //           borderRadius: 50,
    //           cursor: "grap",
    //           width: 8,
    //           height: 6,
    //         },
    //         "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
    //           borderRadius: 8,
    //           backgroundColor: "#bdd8bc",
    //           // border: "1px solid #50cc7f",
    //           cursor: "grap",
    //           minHeight: 24,
    //         },
    //         "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
    //           {
    //             backgroundColor: "#959595",
    //             cursor: "grap",
    //           },
    //         "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
    //           {
    //             backgroundColor: "#959595",
    //             cursor: "grap",
    //           },
    //         "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
    //           {
    //             backgroundColor: "#50cc7f",
    //             cursor: "grap",
    //           },
    //         "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
    //           backgroundColor: "#2b2b2b",
    //           cursor: "grap",
    //         },
    //         // ? Filepond styling
    //         // ".filepond--root": {
    //         //   background: "rgba(247, 255, 237, 0.05) !important",
    //         //   borderRadius: "10px",
    //         //   margin: "0px 10px",
    //         // },
    //         ".filepond--wrapper": { minHeight: "110px" },
    //         ".filepond--credits": { display: "none" },
    //         ".filepond--drop-label": {
    //           background: "rgba(234, 254, 238, 0.5) !important",
    //           border: "1px solid rgba(89, 195, 0, .3)",
    //           borderRadius: "20px",
    //           cursor: "pointer !important",
    //           margin: "10px 10px",
    //           paddingTop: "50px",
    //           paddingBottom: "60px",
    //         },
    //         ".filepond--drop-label:hover": {
    //           background: "rgba(255, 255, 230, 1) !important",
    //         },
    //         ".filepond--drop-label label": {
    //           padding: "0 !important",
    //           whiteSpace: "nowrap",
    //         },
    //         ".filepond--panel-center, .filepond--panel-top, .filepond--panel-bottom":
    //           {
    //             border: "none !important",
    //             background: "transparent !important",
    //           },
    //         ".filepond--root label, .filepond--file-action-button": {
    //           cursor: "pointer !important",
    //         },
    //         ".filepond--item-panel": {
    //           backgroundColor: "#43a047 !important",
    //         },
    //       },
    //     },
    //   },
    // },
  },
  changeMode: (mode) =>
    set((state) => ({
      ...state,
      theme: {
        ...state.theme,
        palette: {
          ...state.theme.palette,
          mode,
        },
        // components: {
        //   ...state.theme.components,
        //   MuiCssBaseline: {
        //     ...state.theme.components.MuiCssBaseline,
        //     styleOverrides: {
        //       ...state.theme.components.MuiCssBaseline.styleOverrides,
        //       body: {
        //         ...state.theme.components.MuiCssBaseline.styleOverrides.body,
        //         ".filepond--drop-label": {
        //           ...state.theme.components.MuiCssBaseline.styleOverrides.body[
        //             ".filepond--drop-label"
        //           ],
        //           background:
        //             mode === "light"
        //               ? "rgba(234, 254, 238, 0.5) !important"
        //               : "rgba(66, 66, 66, 0.5) !important",
        //           border:
        //             mode === "light"
        //               ? "1px solid rgba(89, 195, 0, .3)"
        //               : "1px solid rgba(89, 195, 0, .2)",
        //         },
        //         ".filepond--drop-label:hover": {
        //           background:
        //             mode === "light"
        //               ? "rgba(255, 255, 230, .5) !important"
        //               : "rgba(74, 64, 32, .5) !important",
        //         },
        //       },
        //     },
        //   },
        // },
      },
    })),
  getter: () => {
    const color = localStorage.getItem("__color");

    if (color && color.length === 7)
      set((state) => ({
        ...state,
        theme: {
          ...state.theme,
          palette: {
            ...state.theme.palette,
            primary: {
              ...state.theme.palette.primary,
              main: color,
            },
            error: {
              ...state.theme.palette.error,
              light: "#9c27b0",
            },
          },
          components: {
            ...state.theme.components,
            MuiCssBaseline: {
              ...state.theme.components.MuiCssBaseline,
              styleOverrides: {
                ...state.theme.components.MuiCssBaseline.styleOverrides,
                body: {
                  ...state.theme.components.MuiCssBaseline.styleOverrides.body,
                  ["&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb"]:
                    {
                      ...state.theme.components.MuiCssBaseline.styleOverrides
                        .body[
                        "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb"
                      ],
                      backgroundColor: color,
                    },
                  ["&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover"]:
                    {
                      ...state.theme.components.MuiCssBaseline.styleOverrides
                        .body[
                        "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover"
                      ],
                      backgroundColor: `rgba(${hexToRGB(color).join()}, .5)`,
                    },
                },
              },
            },
          },
        },
      }));
    else
      axios.get(`profile/getColor`).then(({ data }) => {
        const color = !data.color ? defaultPrimaryColor : data.color;

        set((state) => ({
          ...state,
          theme: {
            ...state.theme,
            palette: {
              ...state.theme.palette,
              primary: {
                ...state.theme.palette.primary,
                main: color,
              },
            },
            components: {
              ...state.theme.components,
              MuiCssBaseline: {
                ...state.theme.components.MuiCssBaseline,
                styleOverrides: {
                  ...state.theme.components.MuiCssBaseline.styleOverrides,
                  body: {
                    ...state.theme.components.MuiCssBaseline.styleOverrides
                      .body,
                    ["&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb"]:
                      {
                        ...state.theme.components.MuiCssBaseline.styleOverrides
                          .body[
                          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb"
                        ],
                        backgroundColor: color,
                      },
                    ["&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover"]:
                      {
                        ...state.theme.components.MuiCssBaseline.styleOverrides
                          .body[
                          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover"
                        ],
                        backgroundColor: `rgba(${hexToRGB(color).join()}, .5)`,
                      },
                  },
                },
              },
            },
          },
        }));
        localStorage.setItem("__color", color);
      });
  },
  changeColor: (color) => {
    set((state) => ({
      ...state,
      theme: {
        ...state.theme,
        palette: {
          ...state.theme.palette,
          primary: {
            ...state.theme.palette.primary,
            main: color,
          },
          error: {
            ...state.theme.palette.error,
            light: "#9c27b0",
          },
        },
        components: {
          ...state.theme.components,
          MuiCssBaseline: {
            ...state.theme.components.MuiCssBaseline,
            styleOverrides: {
              ...state.theme.components.MuiCssBaseline.styleOverrides,
              body: {
                ...state.theme.components.MuiCssBaseline.styleOverrides.body,
                ["&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb"]: {
                  ...state.theme.components.MuiCssBaseline.styleOverrides.body[
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb"
                  ],
                  backgroundColor: color,
                },
              },
            },
          },
          // "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
          //   borderRadius: 8,
          //   backgroundColor: "#bdd8bc",
          //   // border: "1px solid #50cc7f",
          //   cursor: "grap",
          //   minHeight: 24,
          // },
        },
      },
    }));

    axios
      .post(`profile/changeColor`, { color })
      .then(({ data }) => localStorage.setItem("__color", color));
  },
  getFont: () => {
    const font = localStorage.getItem("__font");

    if (font)
      set((state) => ({
        ...state,
        theme: {
          ...state.theme,
          typography: {
            ...state.theme.palette.typography,
            fontFamily: font,
          },
        },
      }));
    else
      axios.get(`profile/getFont`).then(({ data }) => {
        const font = !data.font ? defaultFont : data.font;

        set((state) => ({
          ...state,
          theme: {
            ...state.theme,
            typography: {
              ...state.theme.palette.typography,
              fontFamily: font,
            },
          },
        }));
        localStorage.setItem("__font", font);
      });
  },
  changeFont: (font) => {
    set((state) => ({
      ...state,
      theme: {
        ...state.theme,
        typography: {
          ...state.theme.palette.typography,
          fontFamily: font,
        },
      },
    }));

    axios
      .post(`profile/changeFont`, { font })
      .then(({ data }) => localStorage.setItem("__font", font));
  },
}));
