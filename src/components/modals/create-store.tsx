// * React
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
  useRef,
} from "react";

// * Next
import Image from "next/image";

// * NPM
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// * MUI
import Grid from "@mui/material/Grid";

// * SUI
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/shadcn/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import { Slider } from "@/components/ui/shadcn/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn/radio-group";
import { Label } from "@/components/ui/shadcn/label";

// * RUI
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/components/ui/reui/number-field";

// * HUI
import {
  Autocomplete,
  AutocompleteItem,
  Divider,
  Input,
  Button,
  ScrollShadow,
} from "@heroui/react";

// * Components
import __DatePicker__ from "@/components/InputFields/__DatePicker__";
import FileUploader from "@/components/InputFields/FileUploader";
import ModalDialog from "@/components/modal-dialog";

// * Utils
import { cn } from "@/lib/utils";

// * Store
import { useAlertDialogStore } from "@/store/useAlertDialogStore";

// * Assets
import countries from "../../../public/data/countries.json";

// * Icons
import { StoreIcon } from "lucide-react";

// * Schema
const schema = z.object({
  clients: z.array(z.string()),
  name: z.string().min(2, "Min. 2 chars.").max(50, "Max. 50 chars."),
  country: z.object({ code: z.string(), name: z.string() }),
  client: z.string(),
  inventory: z.strictObject({
    label: z.string(),
    file: z.object({
      filename: z.string().nonempty(),
      sheetFields: z.array(
        z.strictObject({ field: z.string(), mapsTo: z.string().nonempty() }),
      ),
      systemFields: z.array(
        z.strictObject({ field: z.string(), sample: z.string() }),
      ),
    }),
  }),
  audit: z.object({
    date: z.date().or(z.string().nonempty()),
    barcode: z.object({
      mode: z.enum(["strict", "variable"]).or(z.string()),
      characters: z.array(z.number().min(1)),
      min: z.number(),
      max: z.number(),
    }),
    locations: z.number().min(1),
  }),
});

type TSchema = z.infer<typeof schema>;

export default function CreateStore({
  isNewItemOpen,
  setIsNewItemOpen,
}: {
  isNewItemOpen: boolean;
  setIsNewItemOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    control,
    formState: { errors, isLoading, isValid, isSubmitting, dirtyFields: dirty },
    handleSubmit,
    register,
    setFocus,
    getValues,
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: async () => ({
      // ? Pre-fetch clients
      clients: (await axios("clients").then(
        ({ data }) => data,
      )) as TSchema["clients"],

      // ? Form fields
      name: "",
      country: { code: "", name: "" },
      client: "",
      inventory: {
        label: "Inventory",
        file: { filename: "", sheetFields: [], systemFields: [] },
      },
      audit: {
        date: "",
        barcode: { mode: "strict", characters: [13], min: 0, max: 30 },
        locations: 1,
      },
    }),
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // ? Form Watchers
  watch("audit.barcode.mode");

  // ? Hooks
  const queryClient = useQueryClient();

  // ? Effects
  useEffect(() => setFocus("name"), [setFocus]);

  // ? State Actions
  const alert = useAlertDialogStore((state) => state.alert);

  // ? Mutations
  const { mutate: createStore } = useMutation({
    mutationFn: (body: TSchema) => axios.post("stores", body),
  });

  return (
    <>
      <DevTool control={control} />

      <ModalDialog
        isNewItemOpen={isNewItemOpen}
        setIsNewItemOpen={setIsNewItemOpen}
        title="Create Store"
        caption="Enter store details, locations in store & upload inventory"
      >
        <form
          onSubmit={handleSubmit((formdata: TSchema) =>
            createStore(formdata, {
              onSuccess: () => {
                setIsNewItemOpen(false);
                queryClient.refetchQueries({
                  queryKey: ["stores"],
                });
              },
              onError: (error) => {
                if (error instanceof AxiosError) {
                  alert({
                    icon: <StoreIcon />,
                    status: "error",
                    subject: error.response?.data.error,
                    body: error.response?.data.message,
                  });
                }
              },
            }),
          )}
        >
          <ScrollShadow size={50} className="h-[50vh] px-5 overflow-x-hidden">
            <div className="flex flex-col gap-3 max-h-[50vh]">
              <Controller
                control={control}
                name="name"
                render={() => (
                  <Input
                    label="Store Name"
                    size="sm"
                    maxLength={20}
                    isRequired
                    variant="faded"
                    color={
                      dirty.name && !errors?.name
                        ? "success"
                        : errors.name
                          ? "danger"
                          : "default"
                    }
                    isInvalid={dirty.name && Boolean(errors.name)}
                    errorMessage={dirty.name && errors.name?.message}
                    {...register("name")}
                  />
                )}
              />

              <div className="flex flex-row gap-3">
                <Controller
                  control={control}
                  name="country.name"
                  render={({ field: { value } }) => (
                    <Autocomplete
                      isRequired
                      isClearable
                      variant="faded"
                      size="sm"
                      label="Country"
                      popoverProps={{ className: "bg-sidebar" }}
                      defaultItems={countries}
                      endContent={
                        <Image
                          src={`https://flagcdn.com/w20/${countries.find(({ country }) => country === value)?.code.toLowerCase()}.png`}
                          alt={value}
                          width={20}
                          height={20}
                          className="-mt-0.5"
                        />
                      }
                      color={
                        dirty.country?.name && !errors?.country?.name
                          ? "success"
                          : errors.country?.name
                            ? "danger"
                            : "default"
                      }
                      isInvalid={
                        dirty.country?.name &&
                        Boolean(errors.country?.name?.message)
                      }
                      errorMessage={
                        dirty.country?.name && errors.country?.name?.message
                      }
                      {...register(`country.name`)}
                      onInputChange={(value) =>
                        setValue(`country.name`, value, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        })
                      }
                      onSelectionChange={(value) =>
                        setValue(`country.code`, value as string, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      {({
                        code,
                        country,
                      }: {
                        code: string;
                        country: string;
                      }) => (
                        <AutocompleteItem
                          key={code}
                          startContent={
                            <Image
                              src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
                              width={20}
                              height={20}
                              alt={country}
                              className="-mt-0.5"
                            />
                          }
                        >
                          {country}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  )}
                />

                {!isLoading && (
                  <Controller
                    control={control}
                    name="client"
                    render={() => {
                      if (getValues().clients.length === 0) {
                        return (
                          <Input
                            label="Client"
                            size="sm"
                            maxLength={20}
                            isRequired
                            variant="faded"
                            color={
                              dirty.client && !errors?.client
                                ? "success"
                                : errors.client
                                  ? "danger"
                                  : "default"
                            }
                            isInvalid={dirty.client && Boolean(errors.client)}
                            errorMessage={
                              dirty.client && errors.client?.message
                            }
                            {...register("client")}
                          />
                        );
                      } else {
                        return (
                          <Autocomplete
                            allowsCustomValue
                            isRequired
                            isClearable
                            label="Client"
                            variant="faded"
                            size="sm"
                            isInvalid={
                              dirty.client && Boolean(errors.client?.message)
                            }
                            errorMessage={
                              dirty.client && Boolean(errors.client?.message)
                            }
                            {...register("client")}
                            onInputChange={(value) =>
                              setValue("client", value, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              })
                            }
                          >
                            {getValues().clients?.map((docket) => (
                              <AutocompleteItem key={docket}>
                                {docket}
                              </AutocompleteItem>
                            ))}
                          </Autocomplete>
                        );
                      }
                    }}
                  />
                )}
              </div>

              <div className="flex flex-row items-center gap-3 mt-3">
                <Divider className="w-1/12 -ml-11" />
                <span className="text-[14px] text-muted-foreground text-nowrap">
                  Audit details
                </span>
                <Divider />
              </div>

              <Grid container spacing={1}>
                <Controller
                  control={control}
                  name="audit.date"
                  render={({ field: { name } }) => (
                    <__DatePicker__
                      columnspan={{ xs: 12, md: 7.5 }}
                      disablePast
                      field={name}
                      dirty={dirty}
                      helperText="Date & time audit is meant to start"
                      label="Audit date"
                      setValue={setValue}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="audit.locations"
                  render={() => (
                    <Grid size={{ xs: 12, md: 4.5 }}>
                      <NumberField
                        {...register("audit.locations")}
                        onValueChange={(value) => {
                          setValue("audit.locations", value as number, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                        }}
                        defaultValue={1}
                        min={1}
                        max={10000}
                        size="lg"
                      >
                        <NumberFieldGroup className="h-12 rounded-md">
                          <NumberFieldDecrement />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <NumberFieldInput />
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <div className="px-1 py-2 max-w-48">
                                <div className="text-small font-bold">
                                  Locations to generate
                                </div>
                                <div className="text-tiny">
                                  This will generate the number of locations
                                  specified. It's important to know the
                                  estimated loccations pre-hand. You can however
                                  delete excess locations later.
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                          <NumberFieldIncrement />
                        </NumberFieldGroup>
                        <div className="flex items-center justify-end">
                          <NumberFieldScrubArea
                            label="Locations to generate"
                            className="text-[2px] text-muted-foreground/80"
                          />
                        </div>
                      </NumberField>
                    </Grid>
                  )}
                />
              </Grid>

              <Controller
                control={control}
                name="audit.barcode.mode"
                render={() => (
                  <RadioGroup
                    defaultValue="strict"
                    className="flex mb-4"
                    {...register(`audit.barcode.mode`)}
                    onValueChange={(value) =>
                      setValue("audit.barcode.mode", value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    {[
                      {
                        value: "strict",
                        title: "Strict barcodes",
                        description: `Barcodes are strictly ${getValues().audit?.barcode.characters[0]} characters.`,
                      },
                      {
                        value: "variable",
                        title: "Variable barcodes",
                        description: "Barcodes have varying characters.",
                      },
                    ].map(({ title, value, description }) => (
                      <FieldLabel key={value} htmlFor={value} className="w-1/2">
                        <Field orientation="horizontal">
                          <RadioGroupItem value={value} id={value} />
                          <FieldContent>
                            <FieldTitle className="flex items-center justify-between font-bold text-md">
                              {title}
                            </FieldTitle>
                            <FieldDescription className="text-[13px]">
                              {description}
                            </FieldDescription>
                          </FieldContent>
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                )}
              />

              {getValues().audit?.barcode.mode === "strict" && (
                <Controller
                  control={control}
                  name="audit.barcode.characters"
                  render={({ field: { value } }) => {
                    return (
                      <section className="border-0 rounded-md px-3 pt-2 pb-5">
                        <Label className="text-sm font-medium">
                          Barcode characters
                        </Label>
                        <div className="relative pt-7">
                          <div
                            className="bg-foreground text-background absolute -top-1 rounded px-2 py-0.5 text-xs font-semibold tabular-nums text-nowrap"
                            style={{
                              left: `${((value[0] - getValues().audit?.barcode.min) / (getValues().audit?.barcode.max - getValues().audit?.barcode.min)) * 100}%`,
                              transform: "translateX(-50%)",
                            }}
                          >
                            {`${value[0]} chars.`}
                            <div className="bg-foreground absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45" />
                          </div>
                        </div>

                        <Slider
                          {...register("audit.barcode.characters")}
                          onValueChange={(value) =>
                            setValue("audit.barcode.characters", value, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            })
                          }
                          defaultValue={[13]}
                          min={getValues().audit?.barcode.min}
                          max={getValues().audit?.barcode.max}
                          step={1}
                        />

                        <span
                          aria-hidden="true"
                          className="text-muted-foreground flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium"
                        >
                          {Array.from(
                            { length: getValues().audit?.barcode.max + 1 },
                            (_, i) => i,
                          ).map((tick) => {
                            return (
                              <span
                                key={tick}
                                className="flex w-0 flex-col items-center justify-center gap-2"
                              >
                                <span
                                  className={cn(
                                    "bg-muted-foreground/70 h-1 w-px",
                                    tick % 5 !== 0 && "h-0.5",
                                  )}
                                />
                                <span
                                  className={cn(tick % 5 !== 0 && "opacity-0")}
                                >
                                  {tick}
                                </span>
                              </span>
                            );
                          })}
                        </span>
                      </section>
                    );
                  }}
                />
              )}

              <Controller
                control={control}
                name="inventory"
                render={({ field }) => (
                  <FileUploader
                    control={control}
                    register={register}
                    field={field}
                    setValue={setValue}
                    allowOnly="spreadsheets"
                    caption="Store's inventory to be audited"
                    maxFileSize="10MB"
                    stylePanelLayout="integrated"
                    stylePanelAspectRatio={"16:5"}
                  />
                )}
              />
            </div>
          </ScrollShadow>

          <footer className="bg-sidebar-accent mx-0 mt-4 flex gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-end">
            <Button
              variant="faded"
              size="sm"
              onPress={() => setIsNewItemOpen(false)}
            >
              Close
            </Button>

            <Button
              type="submit"
              variant={isSubmitting ? "flat" : "solid"}
              size="sm"
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !isValid}
              color="primary"
              spinnerPlacement="end"
            >
              Submit{isSubmitting ? "ting..." : ""}
            </Button>
          </footer>
        </form>
      </ModalDialog>
    </>
  );
}
