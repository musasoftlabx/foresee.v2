// * React
import React, { useState } from "react";

// * NPM
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMask } from "@react-input/mask";
import { HeroTelInput, matchIsValidTel } from "@hyperse/hero-tel-input";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";

// * HUI
import {
  Autocomplete,
  AutocompleteItem,
  cn,
  Divider,
  Input,
  RadioGroup,
  RadioProps,
  useRadio,
  VisuallyHidden,
} from "@heroui/react";

// * MUI
import { Grid, IconButton, Stack, Typography } from "@mui/material";

// * Components
import __FileUploader__ from "@/components/InputFields/__FileUploader__";
import __FormButton__ from "@/components/InputFields/__FormButton__";

// * Store
import { useAlertStore } from "@/store/useAlertStore";

// * Icons
import {
  RiSubtractLine as DeleteIcon,
  RiAddFill as AddIcon,
} from "react-icons/ri";

// * Assets
import nationalities from "../../../../../../public/data/nationalities.json";

// * Schema
const CandidatesSchema = z
  .object({
    docketSuggestions: z.array(z.string()),
    candidatesExcelList: z.strictObject({
      label: z.string().optional(),
      filename: z.string(),
      files: z.array(z.string()).optional(),
    }),
    candidates: z.array(
      z.object({
        docket: z.string().nonempty("Docket is required."),
        party: z.string(),
        firstName: z.string().min(2, "Name cannot be a single character"),
        middleName: z.string(),
        lastName: z.string().min(2, "Name cannot be a single character"),
        nickName: z.string(),
        phoneNumber: z
          .string({
            message: "The phone number is required.",
          })
          .superRefine((phoneNumber, ctx) => {
            if (!matchIsValidTel(phoneNumber)) {
              ctx.addIssue({
                code: "custom",
                message: "The phone number is invalid.",
              });
            }
          }),
        age: z.coerce
          .number()
          .gte(5, "Candidate must be at least 5 years old.")
          .lte(80, "Candidate must be at most 80 years old."),
        nationality: z.string().nonempty(),
        photo: z.strictObject({
          label: z.string().optional(),
          filename: z.string(),
          files: z.array(z.string()).optional(),
        }),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const phoneNumbers = data.candidates.map(({ phoneNumber }) => phoneNumber);
    const duplicates = phoneNumbers.filter(
      (phoneNumber, index) => phoneNumbers.indexOf(phoneNumber) !== index,
    );

    if (duplicates.length) {
      duplicates.forEach((phoneNumber) => {
        const index = phoneNumbers.indexOf(phoneNumber);
        ctx.addIssue({
          path: ["candidates", index, "phoneNumber"],
          message: "Phone number must be unique",
          code: z.ZodIssueCode.custom,
        });
      });
    }
  });

type TCandidates = z.infer<typeof CandidatesSchema>;

export const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps({
        className: cn(
          "group flex-1 items-center hover:opacity-70 active:opacity-50 justify-start flex-row tap-highlight-transparent m-0",
          "max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
          "data-[selected=true]:border-success data-[selected=true]:bg-success/20",
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};

export default function Step2({
  setActiveStep,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const {
    control,
    formState: { errors, isLoading, isValid, isSubmitting, dirtyFields: dirty },
    handleSubmit,
    register,
    getValues,
    setValue,
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(CandidatesSchema),
    defaultValues: {
      docketSuggestions: ["Chair", "Vice chair"],
      candidatesExcelList: {
        label: "Upload Candidates List",
        filename: "",
        files: [],
      },
      candidates: [
        {
          docket: "",
          party: "",
          firstName: "",
          middleName: "",
          lastName: "",
          nickName: "",
          phoneNumber: "",
          age: "",
          nationality: "",
          photo: { label: "Candidate Photo", filename: "", files: [] },
        },
      ],
    },
  });
  // ? States
  const [registrationType, setRegistrationType] = useState<
    "form" | "upload" | string
  >("");

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    { control, name: "candidates" },
  );

  // ? State Actions
  const showAlert = useAlertStore((state) => state.alert);

  // ? Query
  const { data: countryData } = useQuery({
    queryKey: ["country"],
    queryFn: () => axios.get("https://api.country.is/"),
    select: ({ data }) => data,
  });

  // ? Mutations
  const { mutate: updateBallot } = useMutation({
    mutationFn: ({ candidates }: TCandidates) =>
      axios.patch("ballots", { candidates, id: "6907c4b74b3beca1e797de87" }),
  });

  // ? Form Watchers
  watch("candidates");

  return (
    <>
      <DevTool control={control} />

      <RadioGroup
        label="How would you like to register candidates vying for this ballot?"
        orientation="horizontal"
        value={registrationType}
        onChange={(e) => setRegistrationType(e.target.value)}
        className="my-4"
      >
        <CustomRadio
          value="form"
          description="We recommended this in cases where the candidates are few."
        >
          Fill form
        </CustomRadio>
        <CustomRadio
          value="upload"
          description="We recommended this where there are many candidates."
        >
          Upload Excel
        </CustomRadio>
      </RadioGroup>

      {registrationType === "form" ? (
        <>
          <Divider className="mt-8 mb-4" />

          <form
            onSubmit={handleSubmit((formdata: TCandidates) =>
              updateBallot(formdata, {
                onSuccess: () => setActiveStep(3),
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
            <Grid container alignItems="center" spacing={2}>
              {fields.map(({ id }, index) => {
                return (
                  <React.Fragment key={id}>
                    <Typography variant="body1" fontWeight="bold">
                      Candidate {index + 1}
                    </Typography>

                    <Grid container spacing={1}>
                      <Controller
                        control={control}
                        name={`candidates.${index}.docket`}
                        render={() => (
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Autocomplete
                              isRequired
                              allowsCustomValue
                              label="Docket"
                              placeholder="Select / Search / Type docket"
                              variant="faded"
                              size="sm"
                              color={
                                dirty.candidates?.[index]?.docket &&
                                !errors?.candidates?.[index]?.docket
                                  ? "success"
                                  : errors.candidates?.[index]?.docket
                                    ? "danger"
                                    : "default"
                              }
                              isInvalid={
                                dirty.candidates?.[index]?.docket &&
                                Boolean(
                                  errors.candidates?.[index]?.docket?.message,
                                )
                              }
                              errorMessage={
                                dirty.candidates?.[index]?.docket &&
                                errors.candidates?.[index]?.docket?.message
                              }
                              {...register(`candidates.${index}.docket`)}
                              onInputChange={(value) =>
                                setValue(`candidates.${index}.docket`, value, {
                                  shouldDirty: true,
                                  shouldTouch: true,
                                  shouldValidate: true,
                                })
                              }
                            >
                              {getValues().docketSuggestions?.map((docket) => (
                                <AutocompleteItem key={docket}>
                                  {docket}
                                </AutocompleteItem>
                              ))}
                            </Autocomplete>
                          </Grid>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`candidates.${index}.party`}
                        render={() => (
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Input
                              label="Party (Optional)"
                              variant="faded"
                              size="sm"
                              maxLength={50}
                              color={
                                dirty.candidates?.[index]?.party
                                  ? "success"
                                  : "default"
                              }
                              {...register(`candidates.${index}.party`)}
                            />
                          </Grid>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`candidates.${index}.firstName`}
                        render={() => (
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Input
                              label="First Name"
                              //placeholder="Enter the first name of the candidate"
                              //startContent={<RiAccountBoxLine size={21} />}
                              variant="faded"
                              maxLength={20}
                              isRequired
                              size="sm"
                              color={
                                dirty.candidates?.[index]?.firstName &&
                                !errors?.candidates?.[index]?.firstName
                                  ? "success"
                                  : errors.candidates?.[index]?.firstName
                                    ? "danger"
                                    : "default"
                              }
                              isInvalid={
                                dirty.candidates?.[index]?.firstName &&
                                Boolean(errors.candidates?.[index]?.firstName)
                              }
                              errorMessage={
                                dirty.candidates?.[index]?.firstName &&
                                errors.candidates?.[index]?.firstName?.message
                              }
                              {...register(`candidates.${index}.firstName`)}
                            />
                          </Grid>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`candidates.${index}.middleName`}
                        render={() => (
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Input
                              label="Middle Name (Optional)"
                              variant="faded"
                              size="sm"
                              maxLength={20}
                              color={
                                dirty.candidates?.[index]?.middleName
                                  ? "success"
                                  : "default"
                              }
                              {...register(`candidates.${index}.middleName`)}
                            />
                          </Grid>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`candidates.${index}.lastName`}
                        render={() => (
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Input
                              label="Last Name"
                              variant="faded"
                              size="sm"
                              maxLength={20}
                              isRequired
                              color={
                                dirty.candidates?.[index]?.lastName &&
                                !errors?.candidates?.[index]?.lastName
                                  ? "success"
                                  : errors.candidates?.[index]?.lastName
                                    ? "danger"
                                    : "default"
                              }
                              isInvalid={
                                dirty.candidates?.[index]?.lastName &&
                                Boolean(errors.candidates?.[index]?.lastName)
                              }
                              errorMessage={
                                dirty.candidates?.[index]?.lastName &&
                                errors.candidates?.[index]?.lastName?.message
                              }
                              {...register(`candidates.${index}.lastName`)}
                            />
                          </Grid>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`candidates.${index}.nickName`}
                        render={() => (
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Input
                              label="Nickname (Optional)"
                              variant="faded"
                              size="sm"
                              maxLength={20}
                              color={
                                dirty.candidates?.[index]?.nickName
                                  ? "success"
                                  : "default"
                              }
                              {...register(`candidates.${index}.nickName`)}
                            />
                          </Grid>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`candidates.${index}.phoneNumber`}
                        render={({ field, fieldState }) => {
                          return (
                            <Grid size={{ xs: 12, md: 4.5 }}>
                              <HeroTelInput
                                {...field}
                                label="Phone Number"
                                defaultCountry={countryData?.country || "KE"}
                                variant="faded"
                                size="sm"
                                maxLength={20}
                                isRequired
                                className="[&_span]:w-6.25 [&_span]:mt-3 [&_span]:-ml-3 [&_input[type=tel]]:-mb-0.5 [&_input[type=tel]]:-ml-2"
                                color={
                                  dirty.candidates?.[index]?.phoneNumber &&
                                  !errors?.candidates?.[index]?.phoneNumber
                                    ? "success"
                                    : errors.candidates?.[index]?.phoneNumber
                                      ? "danger"
                                      : "default"
                                }
                                isInvalid={
                                  dirty.candidates?.[index]?.phoneNumber &&
                                  Boolean(
                                    errors.candidates?.[index]?.phoneNumber
                                      ?.message,
                                  )
                                }
                                errorMessage={
                                  errors.candidates?.[index]?.phoneNumber
                                    ?.message
                                }
                              />
                            </Grid>
                          );
                        }}
                      />

                      <Controller
                        control={control}
                        name={`candidates.${index}.nationality`}
                        render={({ field: { value } }) => (
                          <Grid size={{ xs: 12, md: 5.5 }}>
                            <Autocomplete
                              isRequired
                              isClearable
                              variant="faded"
                              size="sm"
                              label="Nationality"
                              defaultItems={nationalities}
                              endContent={
                                <img
                                  src={`https://flagcdn.com/w20/${nationalities.find(({ nationality }) => nationality === value)?.alpha_2_code.toLowerCase()}.png`}
                                  alt={value}
                                  width="20"
                                />
                              }
                              color={
                                dirty.candidates?.[index]?.nationality &&
                                !errors?.candidates?.[index]?.nationality
                                  ? "success"
                                  : errors.candidates?.[index]?.nationality
                                    ? "danger"
                                    : "default"
                              }
                              isInvalid={
                                dirty.candidates?.[index]?.nationality &&
                                Boolean(
                                  errors.candidates?.[index]?.nationality
                                    ?.message,
                                )
                              }
                              errorMessage={
                                dirty.candidates?.[index]?.nationality &&
                                errors.candidates?.[index]?.nationality?.message
                              }
                              {...register(`candidates.${index}.nationality`)}
                              onInputChange={(value) =>
                                setValue(
                                  `candidates.${index}.nationality`,
                                  value,
                                  {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                  },
                                )
                              }
                            >
                              {({
                                alpha_2_code,
                                nationality,
                              }: {
                                alpha_2_code: string;
                                nationality: string;
                              }) => (
                                <AutocompleteItem
                                  key={alpha_2_code}
                                  startContent={
                                    <img
                                      src={`https://flagcdn.com/w20/${alpha_2_code.toLowerCase()}.png`}
                                      width="20"
                                      alt={nationality}
                                      className="-mt-0.5"
                                    />
                                  }
                                >
                                  {nationality}
                                </AutocompleteItem>
                              )}
                            </Autocomplete>
                          </Grid>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`candidates.${index}.age`}
                        render={() => {
                          const inputRef = useMask({
                            mask: "__",
                            replacement: { _: /\d/ },
                          });

                          return (
                            <Grid size={{ xs: 12, md: 2 }}>
                              <Input
                                label="Age"
                                variant="faded"
                                size="sm"
                                maxLength={2}
                                isRequired
                                color={
                                  dirty.candidates?.[index]?.age &&
                                  !errors?.candidates?.[index]?.age
                                    ? "success"
                                    : errors.candidates?.[index]?.age
                                      ? "danger"
                                      : "default"
                                }
                                isInvalid={
                                  dirty.candidates?.[index]?.age &&
                                  Boolean(errors.candidates?.[index]?.age)
                                }
                                errorMessage={
                                  dirty.candidates?.[index]?.age &&
                                  errors.candidates?.[index]?.age?.message
                                }
                                {...register(`candidates.${index}.age`, {
                                  onChange: (e) => {
                                    setValue(
                                      `candidates.${index}.age`,
                                      e.target.value,
                                      {
                                        shouldDirty: true,
                                        shouldTouch: true,
                                        shouldValidate: true,
                                      },
                                    );
                                  },
                                })}
                                ref={inputRef}
                              />
                            </Grid>
                          );
                        }}
                      />

                      <Controller
                        control={control}
                        name={`candidates.${index}.photo.filename`}
                        render={({ field }) => (
                          <__FileUploader__
                            acceptedFileTypes={["JPG", "PNG"]}
                            columnspan={{ xs: 12 }}
                            //stylePanelLayout="integrated"
                            //stylePanelAspectRatio={"16:3"}
                            field={field}
                            setValue={setValue}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Stack direction="row" gap={2} justifyContent="flex-end">
                        {fields.length > 1 && (
                          <IconButton
                            onClick={() => remove(index)}
                            sx={{
                              background: "rgba(244, 67, 54, 0.3)",
                              border: "5px double rgba(244, 67, 54, 0.3)",
                              height: 40,
                              width: 40,
                              "&:hover": {
                                background: "rgba(244, 67, 54, 0.5)",
                              },
                            }}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        )}

                        {index === fields.length - 1 && (
                          <IconButton
                            onClick={() => {
                              (() => {
                                append(fields);
                                const currentValues = watch();
                                reset(currentValues, {
                                  keepValues: true,
                                  keepDirty: false,
                                  keepDefaultValues: false,
                                });
                              })();
                            }}
                            disabled={
                              !isValid || errors.candidates?.[index]
                                ? true
                                : false
                            }
                            sx={{
                              background: "rgba(76, 175, 80, 0.4)",
                              border: "5px double rgba(76, 175, 80, 0.3)",
                              height: 40,
                              width: 40,
                              "&:hover": {
                                background: "rgba(76, 175, 80, 0.6)",
                              },
                            }}
                          >
                            <AddIcon color="success" />
                          </IconButton>
                        )}
                      </Stack>
                    </Grid>
                  </React.Fragment>
                );
              })}

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
          </form>
        </>
      ) : registrationType === "upload" ? (
        <>
          <Divider className="my-8" />

          <Controller
            control={control}
            name="candidatesExcelList"
            render={({ field }) => (
              <__FileUploader__
                acceptedFileTypes={["JPG", "PNG"]}
                columnspan={{ xs: 12 }}
                //stylePanelLayout="integrated"
                //stylePanelAspectRatio={"16:3"}
                field={field}
                setValue={setValue}
              />
            )}
          />
        </>
      ) : undefined}
    </>
  );
}
