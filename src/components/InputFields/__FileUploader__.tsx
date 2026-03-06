// * React
import { Fragment } from "react";

// * NPM
import {
  Controller,
  ControllerRenderProps,
  useFieldArray,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { FilePond, FilePondProps, registerPlugin } from "react-filepond";
import { FilePondStyleProps } from "filepond";
import { getCookie } from "cookies-next";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageValidateSize from "filepond-plugin-image-validate-size";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import mime from "mime";

// * MUI
import { grey } from "@mui/material/colors";
import { Grid, Paper, Stack } from "@mui/material";

// * HUI
import { Select, SelectItem } from "@heroui/react";

// * SUI
import { Card, CardContent } from "../ui/shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/shadcn/table";

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
    control?: any;
    register?: any;
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
    control,
    register,
    dimensions,
    field,
    stylePanelLayout,
    setValue,
  } = props;

  const { filename, sheetFields, systemFields, sheets } = field.value.file;

  // ? Hooks
  const sheetFieldsWatcher = useWatch({
    control,
    name: "audit.inventory.file.sheetFields",
  });

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
          {field.value?.file && (
            <div className="text-md font-bold text-center">
              {field.value?.label}
            </div>
          )}
          <FilePond
            {...props}
            acceptedFileTypes={acceptedFileTypes.map((type: string) =>
              mime.getType(type!),
            )}
            onprocessfile={(e, file) => {
              console.log(file);
              const { serverId } = file;
              setValue(
                field.name,
                { ...field.value, file: serverId },
                { shouldDirty: true, shouldTouch: true, shouldValidate: true },
              );
            }}
            credits={false}
            name="file"
            server={{
              url: process.env.NEXT_PUBLIC_API,
              process: {
                headers: {
                  Authorization: `Bearer ${getCookie("__foresee_aT")}`,
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
                onload: (data) => JSON.parse(data),
                onerror: (err) => {
                  if (err) {
                    const { error, message } = JSON.parse(err);
                    showAlert({ status: "error", error, message });
                  }
                },
              },
              revert: ({ filename }) =>
                deleteFile(filename, {
                  onSuccess: () =>
                    setValue(
                      field.name,
                      {
                        ...field.value,
                        file: {
                          filename: "",
                          sheetFields: [],
                          systemFields: [],
                        },
                      },
                      {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      },
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
                          <div style="font-size: 16px; font-weight: 600; color: ${"green"}; opacity: .9">Upload ${field.value.label ?? "Upload file"}</div>
                          <div style="color: ${grey[500]}; font-size: 11px; font-weight: 600;">Only ${acceptedFileTypes.join(", ")} allowed</div>
                          <b style="color: ${grey[500]}; font-size: 11px; margin-top: 2px">(Max of ${props.maxFileSize} allowed)</b>
                        </div>`}
          />

          {caption && (
            <p className=" text-xs text-muted-foreground ml-2">{caption}</p>
          )}

          {sheetFieldsWatcher && sheetFieldsWatcher.length > 0 && (
            <Fragment>
              <div className="text-md font-bold text-center mt-3">
                Field Mapping
              </div>
              <Card className="p-0">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                        <TableHead className="font-bold">
                          Worksheet field
                        </TableHead>
                        <TableHead className="font-bold text-center">
                          Maps to
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sheetFieldsWatcher.map(
                        ({ field }: { field: string }, index: number) => (
                          <TableRow
                            key={index}
                            className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"
                          >
                            <TableCell className="bg-muted/50 w-40 py-2 text-sm font-medium">
                              {field}
                            </TableCell>
                            <TableCell className="bg-muted/50 w-40 py-2 text-sm font-medium">
                              <Controller
                                control={control}
                                name={`audit.inventory.file.sheetFields.${index}.mapsTo`}
                                render={() => (
                                  <Select
                                    size="sm"
                                    variant="underlined"
                                    selectionMode="single"
                                    // selectedKeys={
                                    //   field.value?.file?.sheetFields[key].field
                                    // }
                                    {...register(
                                      `audit.inventory.file.sheetFields.${index}.mapsTo`,
                                    )}
                                    onSelectionChange={(value) =>
                                      setValue(
                                        `audit.inventory.file.sheetFields.${index}.mapsTo`,
                                        value.currentKey,
                                        {
                                          shouldDirty: true,
                                          shouldTouch: true,
                                          shouldValidate: true,
                                        },
                                      )
                                    }
                                  >
                                    {systemFields.map(
                                      ({ field }: { field: string }) => (
                                        <SelectItem key={field}>
                                          {field}
                                        </SelectItem>
                                      ),
                                    )}
                                  </Select>
                                )}
                              />
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Fragment>
          )}
        </Stack>
      </Paper>
    </Grid>
  );
}
