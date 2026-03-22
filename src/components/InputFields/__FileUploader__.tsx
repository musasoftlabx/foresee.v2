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
    acceptedFileTypes: FilePondProps["acceptedFileTypes"];
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
    name: "inventory.file.sheetFields",
  });

  // ? State Actions
  const showAlert = useAlertDialogStore((state) => state.alert);

  // ? Mutations
  const { mutate: deleteFile } = useMutation({
    mutationFn: (file) =>
      axios.delete(`upload?file=${file}&context=${field.name}`),
  });

  return (
    <Fragment>
      <style>{`
      .filepond {
        border: 2px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 12px 18px;
      }
      .filepond--root {
        border: 2px dashed var(--primary);
        border-radius: var(--radius-lg);
        overflow: hidden;
      }
      .filepond--drop-label {
        background-color: var(--sidebar-accent);
        cursor: pointer;
      }
      .filepond--drop-label:hover {
        background-color: var(--secondary);
      }
      .filepond--list-scroller {
        display: none;
      }
    `}</style>

      <div className="filepond flex flex-col gap-3 p-2">
        {field.value?.file && (
          <div className="text-md font-bold text-center">
            {field.value?.label}
          </div>
        )}

        <FilePond
          {...props}
          acceptedFileTypes={acceptedFileTypes?.map((type: string) =>
            mime.getType(type),
          )}
          onprocessfile={(_, file) => {
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
                formData.append("template", field.name);
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
          labelIdle={`<div style="cursor: pointer">
                        <div style="display: flex; justify-content: center; height: 35px; text-align: center">
                          <img src="/icons/filepond/excel.png" style="filter: hue-rotate(175deg)" />
                        </div>
                        <div style="font-size: 16px; font-weight: 600; color: var(--sidebar-primary); opacity: .9">Upload ${field.value.label ?? "Upload file"}</div>
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
      </div>
    </Fragment>
  );
}
