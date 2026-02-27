// * NPM
import { ControllerRenderProps, UseFormSetValue } from "react-hook-form";
import { FilePond, FilePondProps, registerPlugin } from "react-filepond";
import { FilePondStyleProps } from "filepond";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import { getCookie } from "cookies-next";
import { grey } from "@mui/material/colors";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageValidateSize from "filepond-plugin-image-validate-size";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import mime from "mime";

// * Store
import { useAlertStore } from "@/store/useAlertStore";

// * CSS
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// * Register FilePond plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageValidateSize,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
);

export default function __FileUploader__(
  props: FilePondStyleProps & {
    imagePreviewHeight?: number;
    imageCropAspectRatio?: string;
    imageResizeTargetWidth?: number;
    imageResizeTargetHeight?: number;
  } & {
    acceptedFileTypes: Pick<FilePondProps, "acceptedFileTypes"> | any;
    caption?: string;
    circular?: boolean;
    columnspan?: {};
    dimensions?: { height: number; width: number };
    field: Pick<ControllerRenderProps, "name" | "value">;
    maxFileSize: string;
    setValue: UseFormSetValue<any>;
  },
) {
  const {
    acceptedFileTypes,
    columnspan,
    caption,
    circular,
    dimensions,
    field,
    stylePanelLayout,
    setValue,
  } = props;

  // ? State Actions
  const showAlert = useAlertStore((state) => state.alert);

  // ? Mutations
  const { mutate: deleteFile } = useMutation({
    mutationFn: (file) =>
      axios.delete(`upload?file=${file}&context=${field.name}`),
  });

  return (
    <Grid size={columnspan}>
      <Paper
        variant="outlined"
        sx={[
          (theme) => ({
            borderWidth: caption ? 2 : 0,
            borderRadius: 3,
            margin: "auto",
            width: dimensions?.width,
            p: caption ? 2 : 0,
            //pt: caption ? 0 : 0.3,
            ".filepond--root": {
              backgroundColor: theme.vars.palette.grey[100],
              border: `2px dashed ${theme.vars.palette.grey[300]}`,
              borderRadius: circular ? 9999 : 3,
              // height: circular
              //   ? "170px !important"
              //   : stylePanelLayout
              //     ? "unset"
              //     : "100px !important",
              marginBottom: 0,
              overflow: "hidden",
              ":hover": { backgroundColor: theme.vars.palette.grey[200] },
            },
            ".filepond--drop-label": {
              background: theme.vars.palette.grey[100],
              cursor: "pointer !important",
              label: { cursor: "pointer !important" },
              ":hover": { backgroundColor: theme.vars.palette.grey[200] },
              /* min-height: unset !important; */
              //position: "relative !important",
              //padding: "10px 0 !important",

              // transform:
              //   circular || stylePanelLayout
              //     ? "unset"
              //     : "translate3d(0px, 8px, 0px) !important",

              // paddingTop: circular ? "unset" : "45px",
              // paddingBottom: circular ? "unset" : "53px",
            },
            ".filepond--image-preview-wrapper": {
              borderRadius: circular ? "99999rem" : "unset !important",
            },
            ".filepond--credits": { display: "none" },
            ".filepond--panel": { background: theme.vars.palette.grey[100] },
            ".filepond--panel-center, .filepond--panel-top, .filepond--panel-bottom":
              {
                background: "transparent !important",
                border: "none !important",
              },
          }),
          (theme) =>
            theme.applyStyles("dark", {
              ".filepond--root": {
                backgroundColor: "rgba(43, 43, 43, 0.95)",
                border: `2px dashed ${theme.vars.palette.action.disabledBackground}`,
                ":hover": { backgroundColor: theme.vars.palette.grey[900] },
              },
              ".filepond--drop-label": {
                backgroundColor: theme.palette.action.hover,
                ":hover": { backgroundColor: theme.vars.palette.grey[900] },
              },
              ".filepond--panel": {
                backgroundColor: "rgba(43, 43, 43, 0.95)",
                border: "none !important",
              },
            }),
        ]}
      >
        <Stack gap={1}>
          {field.value?.filename && (
            <Typography fontWeight="bold" mt={0} textAlign="center">
              {field.value?.label}
            </Typography>
          )}
          <FilePond
            {...props}
            acceptedFileTypes={acceptedFileTypes.map((type: string) =>
              mime.getType(type!),
            )}
            onprocessfile={(e, file) => {
              const { serverId } = file;
              setValue(
                field.name,
                { ...field.value, filename: serverId, files: [serverId] },
                { shouldDirty: true, shouldTouch: true },
              );
            }}
            credits={false}
            name="file"
            server={{
              url: process.env.NEXT_PUBLIC_API,
              process: {
                headers: {
                  Authorization: `Bearer ${getCookie("__e_ballot_aT")}`,
                },
                method: "POST",
                url: "upload",
                timeout: 30000,
                withCredentials: false,
                ondata: (formData) => {
                  formData.append("context", field.name);
                  formData.append(
                    "prefix",
                    field.value.label!.replaceAll(" ", ""),
                  );
                  return formData;
                },
                onload: (data) => data,
                onerror: (err) => {
                  if (err) {
                    const { error, message } = JSON.parse(err);
                    showAlert({ status: "error", error, message });
                  }
                },
              },
              revert: (file) =>
                deleteFile(file, {
                  onSuccess: () =>
                    setValue(
                      field.name,
                      { ...field.value, filename: "", files: [] },
                      { shouldDirty: true },
                    ),
                  onError: (error) => {
                    if (error instanceof AxiosError)
                      showAlert({
                        status: "error",
                        error: error.response?.data.error,
                        message: error.response?.data.message,
                      });
                  },
                }),
            }}
            labelIdle={`<div>
                          <div style="display: flex; justify-content: center; height: 35px; text-align: center">
                            <img src="/icons/filepond/excel.png" />
                          </div>
                          <div style="font-size: 16px; font-weight: 600; color: ${"green"}; opacity: .9">${field.value.label ?? "Upload file"}</div>
                          <div style="color: ${grey[500]}; font-size: 11px; font-weight: 600;">Only ${acceptedFileTypes.join(", ")} allowed</div>
                          <b style="color: ${grey[500]}; font-size: 11px; margin-top: 2px">(Max of ${props.maxFileSize} allowed)</b>
                        </div>`}
          />
          {caption && (
            <p className=" text-xs text-muted-foreground ml-2">{caption}</p>
          )}
        </Stack>
      </Paper>
    </Grid>
  );
}

{
  /* <svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enable-background="new 0 0 48 48">
                            <g fill="#FF9800">
                              <rect x="36.1" y="8.1" transform="matrix(.707 .707 -.707 .707 21.201 -25.184)" width="9.9" height="9.9"/>
                              <rect x="36" y="8" width="10" height="10"/>
                            </g>
                            <circle fill="#FFEB3B" cx="41" cy="13" r="3"/>
                            <polygon fill="#2E7D32" points="16.5,18 0,42 33,42"/>
                            <polygon fill="#4CAF50" points="33.6,24 19.2,42 48,42"/>
                            </svg> */
}

{
  /* <FilePondLabel
  acceptedFileTypes={acceptedFileTypes}
  field={field}
/> */
}
