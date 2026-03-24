// * React
import { Fragment } from "react";

// * NPM
import {
  type ControllerRenderProps,
  type UseFormSetValue,
  Controller,
  useWatch,
} from "react-hook-form";
import { FilePond, type FilePondProps, registerPlugin } from "react-filepond";
import type { FilePondStyleProps } from "filepond";
import { getCookie } from "cookies-next";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageValidateSize from "filepond-plugin-image-validate-size";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import mime from "mime";

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
import { useAlertDialogStore } from "@/store/useAlertDialogStore";

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

export default function FileUploader(
  props: FilePondStyleProps & {
    imagePreviewHeight?: number;
    imageCropAspectRatio?: string;
    imageResizeTargetWidth?: number;
    imageResizeTargetHeight?: number;
  } & {
    allowOnly: "images" | "spreadsheets" | "documents" | "pdf";
    caption?: string;
    circular?: boolean;
    control?: any;
    register?: any;
    dimensions?: { height: number; width: number };
    field: Pick<ControllerRenderProps, "name" | "value">;
    maxFileSize: string;
    setValue: UseFormSetValue<any>;
  },
) {
  const { allowOnly, caption, control, register, field: f, setValue } = props;

  //const { filename, sheetFields, systemFields, sheets } = field.value.file;

  // ? Hooks
  const sheetFieldsWatcher = useWatch({
    control,
    name: "inventory.file.sheetFields",
  });

  console.log(sheetFieldsWatcher);

  // ? State Actions
  const alert = useAlertDialogStore((state) => state.alert);

  // ? Mutations
  const { mutate: deleteFile } = useMutation({
    mutationFn: (file) => axios.delete(`upload?file=${file}&context=${f.name}`),
  });

  let acceptedFileTypes = [];
  let filterDegree = 0;

  switch (allowOnly) {
    case "pdf":
      acceptedFileTypes = ["PDF"];
      filterDegree = 285;
      break;
    case "images":
      acceptedFileTypes = ["PNG", "JPG", "JPEG", "GIF"];
      filterDegree = 270;
      break;
    case "spreadsheets":
      acceptedFileTypes = ["XLSX", "XLS", "XSLB", "CSV"];
      filterDegree = 175;
      break;
    case "documents":
      acceptedFileTypes = ["DOC", "DOCX"];
      filterDegree = 285;
      break;
  }

  return (
    <Fragment>
      <style>
        {`
          .filepond { border: 2px solid var(--border); border-radius: var(--radius-lg); padding: 12px 18px; padding-top: 20px; }
          .filepond--root { color: var(--card-foreground) !important; border: 2px dashed var(--primary); border-radius: var(--radius-lg); overflow: hidden; }
          .filepond--drop-label { background-color: var(--sidebar); cursor: pointer; }
          .filepond--drop-label:hover { background-color: var(--sidebar-accent); }
          .filepond--image-preview-overlay-success { color: var(--primary); }

          .filepond--file-action-button:hover,
          .filepond--file-action-button:focus {
            cursor: pointer;
          }

          [data-filepond-item-state="idle"] .filepond--item-panel,
          [data-filepond-item-state="busy processing"] .filepond--item-panel,
          [data-filepond-item-state="processing"] .filepond--item-panel {
            background: var(--sidebar) !important; 
          }

          [data-filepond-item-state="idle"] .filepond--file,
          [data-filepond-item-state="busy processing"] .filepond--file,
          [data-filepond-item-state="processing"] .filepond--file { 
            color: var(--chart-5) !important;
            font-weight: bold;
          }

          [data-filepond-item-state="processing-complete"] .filepond--item-panel {
            background: var(--chart-5) !important;
          }

          .filepond--panel-top.filepond--item-panel,
          .filepond--panel-center.filepond--item-panel,
          .filepond--panel-bottom.filepond--item-panel {
            background: transparent !important;
          }

          .filepond--root[data-style-panel-layout~="circle"] .filepond--item-panel,
          .filepond--root[data-style-panel-layout~="integrated"] .filepond--item-panel {
            display: block
          }
          
          [data-filepond-item-state*="error"] .filepond--item-panel,
          [data-filepond-item-state*="load-invalid"] .filepond--item-panel,
          [data-filepond-item-state*="invalid"] .filepond--item-panel {
            -background: color-mix(in oklab, var(--destructive) 20%, transparent) !important;
            background: var(--destructive) !important;
          }

          [data-filepond-item-state*="error"] .filepond--item-panel .filepond--panel-center::after,
          [data-filepond-item-state*="invalid"] .filepond--item-panel .filepond--panel-center::after {
            content: url(/icons/filepond/${allowOnly}.png);
            filter: hue-rotate(260deg);
            top: 50%;
            left: 50%;
            transform: scale(0.6) translate(-80%, -80%) !important;
            position: absolute; 
          }

          .filepond--panel-center::after {
            content: url(/icons/filepond/${allowOnly}.png);
            filter: hue-rotate(${filterDegree}deg);
            top: 50%;
            left: 50%;
            transform: scale(0.6) translate(-80%, -80%) !important;
            position: absolute;
          }
        `}
      </style>

      <div className="filepond flex flex-col gap-3 p-2">
        {/* {f.value?.file && (
          <div className="text-md font-bold text-center">{f.value?.label}</div>
        )} */}

        <FilePond
          {...props}
          acceptedFileTypes={
            acceptedFileTypes.map(
              (type) => type && mime.getType(type),
            ) as FilePondProps["acceptedFileTypes"]
          }
          onprocessfile={(_, file) => {
            const { serverId } = file;
            setValue(
              f.name,
              { ...f.value, file: serverId },
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
                formData.append("context", f.name);
                formData.append("template", f.name);
                formData.append("prefix", f.value.label.replaceAll(" ", ""));
                return formData;
              },
              onload: (data) => JSON.parse(data),
              onerror: (error) => {
                if (error instanceof AxiosError) console.log("error");
                // alert({
                //   status: "error",
                //   subject: error.response?.data.error,
                //   body: error.response?.data.message,
                // });
              },
            },
            revert: ({ filename }) =>
              deleteFile(filename, {
                onSuccess: () =>
                  setValue(
                    f.name,
                    {
                      ...f.value,
                      file: { filename: "", sheetFields: [], systemFields: [] },
                    },
                    {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    },
                  ),
                onError: (error) => {
                  if (error instanceof AxiosError)
                    alert({
                      status: "error",
                      subject: error.response?.data.error,
                      body: error.response?.data.message,
                    });
                },
              }),
          }}
          labelIdle={`<div style="cursor: pointer">
                        <div style="display: flex; justify-content: center; height: 35px; text-align: center">
                          <img src="/icons/filepond/${allowOnly}.png" style="filter: hue-rotate(${filterDegree}deg)" />
                        </div>
                        <div style="font-size: 16px; font-weight: 600; color: var(--sidebar-primary); opacity: .9">Upload ${f.value.label ?? "Upload file"}</div>
                        <div style="color: var(--sidebar-accent-foreground); font-size: 11px; font-weight: 600;">Only ${acceptedFileTypes.join(", ")} allowed</div>
                        <b style="color: var(--muted-foreground); font-size: 11px; margin-top: 2px">(Max of ${props.maxFileSize} allowed)</b>
                      </div>`}
        />

        {caption && (
          <p className="text-xs text-muted-foreground ml-2">{caption}</p>
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
                      <TableHead className="font-bold text-primary">
                        Worksheet field
                      </TableHead>
                      <TableHead className="font-bold text-primary text-center">
                        Maps to
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sheetFieldsWatcher.map(
                      ({ field }: { field: string }, index: number) => (
                        <TableRow
                          key={field}
                          className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"
                        >
                          <TableCell className="bg-muted/50 w-40 py-2 text-sm font-medium">
                            {field}
                          </TableCell>
                          <TableCell className="bg-muted/50 w-40 py-2 text-sm font-medium">
                            <Controller
                              control={control}
                              name={`inventory.file.sheetFields.${index}.mapsTo`}
                              render={() => (
                                <Select
                                  size="sm"
                                  variant="underlined"
                                  selectionMode="single"
                                  // selectedKeys={
                                  //   field.value?.file?.sheetFields[key].field
                                  // }
                                  {...register(
                                    `inventory.file.sheetFields.${index}.mapsTo`,
                                  )}
                                  onSelectionChange={(value) =>
                                    setValue(
                                      `inventory.file.sheetFields.${index}.mapsTo`,
                                      value.currentKey,
                                      {
                                        shouldDirty: true,
                                        shouldTouch: true,
                                        shouldValidate: true,
                                      },
                                    )
                                  }
                                >
                                  {f.value.file.systemFields.map(
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
      </div>
    </Fragment>
  );
}
