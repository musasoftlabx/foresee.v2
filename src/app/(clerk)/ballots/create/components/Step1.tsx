// * React
import React, { Fragment, useEffect } from "react";

// * Next
import Link from "next/link";

// * Node
import { UrlObject } from "url";

// * NPM
import * as z from "zod";
import { camelCase } from "lodash";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sketch } from "@uiw/react-color";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";

// * MUI
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

// * HUI
import { Input, Textarea } from "@heroui/input";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from "@heroui/react";

// * Components
import { __TextField__ } from "@/components/InputFields/__TextField__";
import __FormButton__ from "@/components/InputFields/__FormButton__";
import __DatePicker__ from "@/components/InputFields/__DatePicker__";
import __FileUploader__ from "@/components/InputFields/__FileUploader__";

// * Icons
import { BiBox } from "react-icons/bi";
import { TbMessage } from "react-icons/tb";
import { LiaAddressCardSolid } from "react-icons/lia";

// * Stores
import { defaultPrimaryColor } from "@/store/useThemeStore";
import { useAlertStore } from "@/store/useAlertStore";

// * Schema
const CreateBallotSchema = z.object({
  authTypes: z.array(z.string()),
  name: z.string().min(5, "Min. 5 chars.").max(50, "Max. 50 chars."),
  ballot: z.string(),
  description: z.string(),
  startsOn: z.date().or(z.string().nonempty()),
  endsOn: z.date().or(z.string().nonempty("Should be after start date.")),
  authType: z.string().nonempty(),
  themeColor: z
    .string()
    .regex(
      new RegExp(
        /^rgba?\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}\s*(?:,\s*(?:\d*\.?\d+|\d{1,3}%)\s*)?\)$/,
      ),
      "Invalid RGB or RGBA color format. Expected format: rgb(r, g, b) or rgba(r, g, b, a) with values 0-255.",
    )
    .optional(),
  logo: z.strictObject({
    label: z.string().optional(),
    filename: z.string(),
    files: z.array(z.string()).optional(),
  }),
  backdrop: z.strictObject({
    label: z.string().optional(),
    filename: z.string(),
    files: z.array(z.string()).optional(),
  }),
});

type TCreateBallot = z.infer<typeof CreateBallotSchema>;

export default function Step1({
  setActiveStep,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  // ? Form hooks
  const {
    control,
    formState: { errors, isLoading, isValid, isSubmitting, dirtyFields: dirty },
    handleSubmit,
    getValues,
    setFocus,
    setValue,
    register,
    watch,
  } = useForm({
    defaultValues: async () => {
      return {
        // ? Pre-fetch auth types
        authTypes: (await axios("authTypes").then(
          ({ data: { types } }) => types,
        )) as TCreateBallot["authTypes"],

        // ? Form fields
        name: "",
        ballot: "",
        description: "",
        startsOn: "",
        endsOn: "",
        authType: "",
        themeColor: defaultPrimaryColor,
        logo: { label: "Logo", filename: "", files: [] },
        backdrop: { label: "Backdrop", filename: "", files: [] },
      };
    },
    mode: "onChange",
    resolver: zodResolver(CreateBallotSchema),
  });

  // ? Form Watchers
  const watchName = watch("name");
  const watchDescription = watch("description");
  const watchStartsOn = watch("startsOn");

  // ? Effects
  useEffect(() => setFocus("name"), [setFocus]);

  // ? State Actions
  const showAlert = useAlertStore((state) => state.alert);

  // ? Mutations
  const { mutate: createBallot } = useMutation({
    mutationFn: ({
      authType: name,
      ballot,
      description,
      startsOn,
      endsOn,
      authType,
      themeColor,
      logo: { filename: logo },
      backdrop: { filename: backdrop },
    }: TCreateBallot) =>
      axios.post("ballots", {
        name,
        ballot,
        description,
        startsOn,
        endsOn,
        authType,
        themeColor,
        logo,
        backdrop,
      }),
  });

  return (
    <>
      <DevTool control={control} />

      <form
        onSubmit={handleSubmit((formdata: TCreateBallot) =>
          createBallot(formdata, {
            onSuccess: () => setActiveStep(2),
            onError: (error) => {
              if (error instanceof AxiosError) {
                showAlert({
                  status: "error",
                  error: error.response?.data.error,
                  message: error.response?.data.message,
                });
              }
            },
          }),
        )}
      >
        {isLoading ? (
          <Stack alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        ) : (
          <Grid container spacing={1}>
            <Paper
              variant="outlined"
              sx={
                watchName?.length > 0
                  ? { borderWidth: 1, borderRadius: 2, p: 2 }
                  : { borderWidth: 0, borderRadius: 0, flex: 1, p: 0 }
              }
            >
              <Controller
                control={control}
                name="name"
                render={({ field: { value } }) => (
                  <Input
                    label="Ballot Name"
                    size="sm"
                    //placeholder="Enter the name of the ballot"
                    //startContent={<BiBox size={20} />}
                    maxLength={50}
                    isRequired
                    isInvalid={dirty.name && Boolean(errors.name?.message)}
                    //className="border-1 border-default-100 rounded-md"
                    color={
                      dirty.name && !errors.name
                        ? "success"
                        : errors.name
                          ? "danger"
                          : "default"
                    }
                    errorMessage={
                      dirty.name
                        ? errors.name?.message
                        : value?.length > 0 &&
                          `Max chars. 50 | Current ${value?.length} chars.`
                    }
                    {...register("name", {
                      onChange: (e) => {
                        setValue("name", e.target.value, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                        setValue("ballot", camelCase(e.target.value));
                      },
                    })}
                  />
                )}
              />

              <Controller
                control={control}
                name="ballot"
                render={({ field: { value } }) =>
                  value ? (
                    <Stack px={1}>
                      <Typography mt={1.5}>
                        The public URL for this election will look like this
                      </Typography>
                      <Typography
                        color="primary"
                        fontWeight={600}
                        mb={1.5}
                        sx={{ textDecoration: "underline" }}
                        variant="body2"
                      >
                        <Link
                          href={
                            `${window.location.protocol}//${window.location.hostname}${window.location.port && `:${window.location.port}`}/${camelCase(value)}` as unknown as UrlObject
                          }
                          target="_blank"
                        >
                          {window.location.protocol}//
                          {window.location.hostname}
                          {window.location.port && `:${window.location.port}`}/
                          {camelCase(value)}
                        </Link>
                      </Typography>
                      <Typography variant="caption">
                        We suggest that you use a shorter ballot name to make it
                        easier for voters to memorize the link.
                      </Typography>
                    </Stack>
                  ) : (
                    <Fragment />
                  )
                }
              />
            </Paper>

            <Controller
              control={control}
              name="description"
              render={() => (
                <Textarea
                  label="Description (Optional)"
                  placeholder="Few words to describe this ballot / election"
                  startContent={<TbMessage className="-mt-0.5 text-2xl" />}
                  size="sm"
                  description={`${watchDescription?.length} / 100`}
                  maxLength={100}
                  isInvalid={
                    dirty.description && Boolean(errors.description?.message)
                  }
                  errorMessage={
                    dirty.description && errors.description?.message
                  }
                  {...register("description")}
                />
              )}
            />

            <Controller
              control={control}
              name="startsOn"
              render={({ field: { name } }) => (
                <__DatePicker__
                  columnspan={{ xs: 12, md: 6 }}
                  disablePast
                  field={name}
                  dirty={dirty}
                  helperText="Date & exact time the ballot will open"
                  label="Voting Starts On"
                  setValue={setValue}
                />
              )}
            />

            <Controller
              control={control}
              name="endsOn"
              render={({ field: { name } }) => (
                <__DatePicker__
                  columnspan={{ xs: 12, md: 6 }}
                  disabled={!watch("startsOn")}
                  disablePast
                  field={name}
                  dirty={dirty}
                  helperText="Date & exact time the ballot will close"
                  label="Voting Ends On"
                  minDateTime={dayjs(watchStartsOn)}
                  setValue={setValue}
                />
              )}
            />

            <Controller
              control={control}
              name="authType"
              render={() => (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Select
                    isRequired
                    isClearable
                    label="Authorization Type"
                    placeholder="ID that voters will use to login"
                    size="sm"
                    isInvalid={
                      dirty.authType && Boolean(errors.authType?.message)
                    }
                    errorMessage={dirty.authType && errors.authType?.message}
                    color={dirty.authType ? "success" : "default"}
                    {...register("authType", {
                      onChange: (e) =>
                        setValue("authType", e.target.value, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        }),
                    })}
                  >
                    {getValues().authTypes?.map((authType) => (
                      <SelectItem key={authType}>{authType}</SelectItem>
                    ))}
                  </Select>
                </Grid>
              )}
            />

            <Controller
              control={control}
              name="themeColor"
              render={({ field }) => (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Input
                    label="Theme color (Optional)"
                    placeholder="Color theme of the ballot UI"
                    size="sm"
                    endContent={
                      <Popover placement="bottom-end">
                        <PopoverTrigger>
                          <Button
                            isIconOnly
                            variant="ghost"
                            radius="full"
                            className="top-0.5"
                          >
                            <Box
                              width={30}
                              height={30}
                              borderRadius={20}
                              sx={{ backgroundColor: field.value }}
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Sketch
                            defaultValue={field.value}
                            color={field.value}
                            onChange={(color) =>
                              setValue(
                                "themeColor",
                                `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`,
                                {
                                  shouldDirty: true,
                                  shouldTouch: true,
                                  shouldValidate: true,
                                },
                              )
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    }
                    defaultValue={field.value}
                    color={
                      dirty.themeColor && !errors.themeColor
                        ? "success"
                        : errors.themeColor
                          ? "danger"
                          : "default"
                    }
                    errorMessage={
                      dirty.themeColor && errors.themeColor?.message
                    }
                    isInvalid={
                      dirty.themeColor && Boolean(errors.themeColor?.message)
                    }
                    {...register("themeColor")}
                  />
                </Grid>
              )}
            />

            <Controller
              control={control}
              name="logo"
              render={({ field }) => (
                <__FileUploader__
                  acceptedFileTypes={["JPG", "PNG"]}
                  columnspan={{ xs: 12 }}
                  dimensions={{ height: 200, width: 200 }}
                  field={field}
                  circular={false}
                  setValue={setValue}
                  imagePreviewHeight={10}
                  imageCropAspectRatio="1:1"
                  imageResizeTargetWidth={150}
                  imageResizeTargetHeight={150}
                  stylePanelLayout="compact circle"
                  styleLoadIndicatorPosition="center bottom"
                  styleProgressIndicatorPosition="right bottom"
                  styleButtonRemoveItemPosition="left bottom"
                  styleButtonProcessItemPosition="right bottom"
                />
              )}
            />

            <Controller
              control={control}
              name="backdrop"
              render={({ field }) => (
                <__FileUploader__
                  acceptedFileTypes={["JPG", "PNG"]}
                  caption="Background to be placed the login screen."
                  columnspan={{ xs: 12 }}
                  //stylePanelLayout="integrated"
                  //stylePanelAspectRatio={"16:3"}
                  field={field}
                  setValue={setValue}
                />
              )}
            />

            <__FormButton__
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              loadingText="PROCEEDING..."
              size="lg"
              variant={!isValid || isSubmitting ? "bordered" : "shadow"}
            >
              PROCEED
            </__FormButton__>
          </Grid>
        )}
      </form>
    </>
  );
}
