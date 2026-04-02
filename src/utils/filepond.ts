import { useThemeStore } from "@/store/useThemeStore";
import { grey, lime } from "@mui/material/colors";

export const filepondLabel = ({
  label,
  extensions,
}: {
  label?: string;
  extensions: string[];
}) => {
  const theme = useThemeStore((state) => state.theme);

  return `<div style="cursor:pointer; margin: 0px 0px;">
            <div style="display: flex; justify-content: center; height: 35px; text-align: center">
                <svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enable-background="new 0 0 48 48">
                <g fill="#FF9800">
                    <rect x="36.1" y="8.1" transform="matrix(.707 .707 -.707 .707 21.201 -25.184)" width="9.9" height="9.9"/>
                    <rect x="36" y="8" width="10" height="10"/>
                </g>
                <circle fill="#FFEB3B" cx="41" cy="13" r="3"/>
                <polygon fill="#2E7D32" points="16.5,18 0,42 33,42"/>
                <polygon fill="#4CAF50" points="33.6,24 19.2,42 48,42"/>
                </svg>
            </div>
            <div style="font-size: 15px; font-weight: 600; color: ${
              "green"
              //theme.vars.palette.primary
            }; opacity: .9">${label ?? "Upload file"}</div>
            <div style="color: ${
              grey[500]
            }; font-size: 11px; font-weight: 600;">Only ${extensions.join(
              ", "
            )} allowed</div>
        </div>`;
};
