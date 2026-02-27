// * React
import React, {
  Fragment,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

// * SUI
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import { Slider } from "@/components/ui/shadcn/slider";

// * REUI
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  useDraggable,
} from "@heroui/react";

// * Components
import __DatePicker__ from "@/components/InputFields/__DatePicker__";
import __FileUploader__ from "@/components/InputFields/__FileUploader__";
import { XIcon } from "@/components/ui/lucide-animated/x";

// * NPM
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// * Schema
const schema = z.object({
  clients: z.array(z.string()),
  name: z.string().min(2, "Min. 2 chars.").max(50, "Max. 50 chars."),
  country: z.string(),
  client: z.string(),
  audit: z.object({
    date: z.date().or(z.string().nonempty()),
    barcode: z.object({
      mode: z.enum(["strict", "variable"]),
      //mode: z.union([z.literal("strict"), z.literal("variable")]),
      characters: z.array(z.number().min(1)),
      min: z.number(),
      max: z.number(),
    }),
    locations: z.number().min(1),
    products: z.strictObject({
      label: z.string().optional(),
      filename: z.string(),
      files: z.array(z.string()).optional(),
    }),
  }),
});

// * Assets
import countries from "../../../../public/data/countries.json";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/shadcn/label";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/shadcn/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn/radio-group";
import Grid from "@mui/material/Grid";

type TSchema = z.infer<typeof schema>;

export default function CreateStore({
  isAddItemOpen,
  setIsAddItemOpen,
}: {
  isAddItemOpen: boolean;
  setIsAddItemOpen: React.Dispatch<SetStateAction<boolean>>;
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
      //clients: (await axios("authTypes").then(({ data: { types } }) => types,)) as TSchema["clients"],
      clients: ["LC Waikiki", "FLO"],

      // ? Form fields
      name: "",
      country: "",
      client: "",
      audit: {
        date: "",
        barcode: { mode: "strict", characters: [13], min: 0, max: 30 },
        locations: 1,
        products: { label: "Upload Products", filename: "", files: [] },
      },
    }),
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // ? Hooks
  const queryClient = useQueryClient();

  // ? Effects
  useEffect(() => setFocus("name"), [setFocus]);

  // ? Mutations
  const { mutate: createStore } = useMutation({
    mutationFn: (body: TSchema) => axios.post("stores", body),
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const targetRef = useRef<RefObject<HTMLElement> | any>(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  return (
    <>
      <DevTool control={control} />

      <Modal
        ref={targetRef}
        backdrop="blur"
        shadow="lg"
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onOpenChange={onOpenChange}
        draggable
        isDismissable={false}
        closeButton={<XIcon size={20} className="pt-36" />}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeIn" },
            },
          },
        }}
        className="overflow-x-hidden"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader {...moveProps} className="flex flex-col gap-1">
                Create Store
                <p className="text-xs text-muted-foreground">
                  Enter store details, locations in store & products
                </p>
              </ModalHeader>

              <form
                onSubmit={handleSubmit((formdata: TSchema) =>
                  createStore(formdata, {
                    onSuccess: () => {
                      // setIsAddItemOpen(false);
                      // queryClient.refetchQueries({
                      //   queryKey: ["stores"],
                      // });
                    },
                    onError: (error) => {
                      if (error instanceof AxiosError) {
                        // showAlert({
                        //   status: "error",
                        //   error: error.response?.data.error,
                        //   message: error.response?.data.message,
                        // });
                      }
                    },
                  }),
                )}
              >
                <ModalBody>
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
                      name="country"
                      render={({ field: { value } }) => (
                        <Autocomplete
                          isRequired
                          isClearable
                          variant="faded"
                          size="sm"
                          label="Country"
                          defaultItems={countries}
                          endContent={
                            <img
                              src={`https://flagcdn.com/w20/${countries.find(({ country }) => country === value)?.code.toLowerCase()}.png`}
                              alt={value}
                              width="20"
                            />
                          }
                          color={
                            dirty.country && !errors?.country
                              ? "success"
                              : errors.country
                                ? "danger"
                                : "default"
                          }
                          isInvalid={
                            dirty.country && Boolean(errors.country?.message)
                          }
                          errorMessage={
                            dirty.country && errors.country?.message
                          }
                          {...register(`country`)}
                          onInputChange={(value) =>
                            setValue(`country`, value, {
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
                                <img
                                  src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
                                  width="20"
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

                    <Controller
                      control={control}
                      name="client"
                      render={() => (
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
                      )}
                    />
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
                              setValue("audit.locations", value!, {
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
                                      estimated loccations pre-hand. You can
                                      however delete excess locations later.
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
                                left: `${((value[0] - getValues().audit.barcode.min) / (getValues().audit.barcode.max - getValues().audit.barcode.min)) * 100}%`,
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
                            min={getValues().audit.barcode.min}
                            max={getValues().audit.barcode.max}
                            step={1}
                          />

                          <span
                            aria-hidden="true"
                            className="text-muted-foreground flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium"
                          >
                            {Array.from(
                              { length: getValues().audit.barcode.max + 1 },
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
                                    className={cn(
                                      tick % 5 !== 0 && "opacity-0",
                                    )}
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

                  <Controller
                    control={control}
                    name="audit.barcode.mode"
                    render={() => (
                      <RadioGroup
                        defaultValue="strict"
                        className="flex mb-4"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setValue("audit.barcode.mode", e.target.value, {
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
                            description: `Barcodes are strictly ${getValues().audit.barcode.characters[0]} characters.`,
                          },
                          {
                            value: "variable",
                            title: "Variable barcodes",
                            description: "Barcodes have varying characters.",
                          },
                        ].map(({ title, value, description }, key) => (
                          <FieldLabel
                            key={key}
                            htmlFor={value}
                            className="w-1/2"
                          >
                            <Field orientation="horizontal">
                              <RadioGroupItem value={value} id={value} />
                              <FieldContent>
                                <FieldTitle className="flex items-center justify-between">
                                  <span>{title}</span>
                                </FieldTitle>
                                <FieldDescription>
                                  {description}
                                </FieldDescription>
                              </FieldContent>
                            </Field>
                          </FieldLabel>
                        ))}
                      </RadioGroup>
                    )}
                  />

                  <Controller
                    control={control}
                    name="audit.products"
                    render={({ field }) => (
                      <__FileUploader__
                        acceptedFileTypes={["XLSX", "XLS", "CSV"]}
                        caption="List of products to be audited"
                        maxFileSize="50MB"
                        columnspan={{ xs: 12 }}
                        stylePanelLayout="integrated"
                        stylePanelAspectRatio={"16:5"}
                        field={field}
                        setValue={setValue}
                      />
                    )}
                  />
                </ModalBody>

                <Divider className="mt-4" />

                <ModalFooter>
                  <Button variant="faded" size="sm" onPress={onClose}>
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
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
