import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";

// * MUI
import {
  //Autocomplete,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInputProps,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

// * Icons
import { RiAccountPinBoxLine } from "react-icons/ri";

// * Icons
import ButtonX from "@/components/InputFields/ButtonX";
import { TextFieldX } from "@/components/InputFields/TextFieldX";

import __FileUploader__ from "@/components/InputFields/__FileUploader__";
import { __TextField__ } from "@/components/InputFields/__TextField__";
import { useAlertStore } from "@/store/useAlertStore";
import React from "react";

import {
  RiSubtractLine as DeleteIcon,
  RiAddFill as AddIcon,
} from "react-icons/ri";
import { HiOutlineArchiveBox } from "react-icons/hi2";
import { TbMessage } from "react-icons/tb";
import { DevTool } from "@hookform/devtools";
import { MdStore } from "react-icons/md";

import {
  Autocomplete,
  AutocompleteItem,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import __FormButton__ from "@/components/InputFields/__FormButton__";

const DocketsSchema = z.object({
  docketSuggestions: z.array(z.string()),
  //docketSuggestions: z.array(z.object({ key: z.number(), label: z.string() })),
  dockets: z.array(
    z.object({
      docket: z.string().nonempty("Docket is required."),
      description: z.string(),
    })
  ),
});

type TDockets = z.infer<typeof DocketsSchema>;

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
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(DocketsSchema),
    defaultValues: {
      dockets: [{ docket: "", description: "" }],
      docketSuggestions: ["Chair", "Vice chair"],
      // docketSuggestions: [
      //   { key: 1, label: "Chair" },
      //   { key: 2, label: "Vice chair" },
      // ], //(await axios("authTypes").then(({ data: { types } }) => types)) as TCreateBallot["docketSuggestions"],
    },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    { control, name: "dockets" }
  );

  // ? State Actions
  const showAlert = useAlertStore((state) => state.alert);

  // ? Mutations
  const { mutate: updateBallot } = useMutation({
    mutationFn: ({ dockets }: TDockets) =>
      axios.patch("ballots", { dockets, id: "6907c4b74b3beca1e797de87" }),
  });

  return (
    <>
      <DevTool control={control} />

      <form
        onSubmit={handleSubmit((formdata: TDockets) =>
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
          })
        )}
      >
        <Grid container alignItems="center" spacing={2}>
          {fields.map(({ id }, index) => {
            const watchDescription = watch(`dockets.${index}.description`);

            return (
              <React.Fragment key={id}>
                <Controller
                  control={control}
                  name="dockets"
                  render={() => (
                    <Autocomplete
                      isRequired
                      label={`Docket ${index + 1}`}
                      placeholder="Select / Search docket"
                      variant="faded"
                      isInvalid={
                        dirty.dockets?.[index].docket &&
                        Boolean(errors.dockets?.[index]?.docket?.message)
                      }
                      errorMessage={
                        dirty.dockets?.[index].docket &&
                        Boolean(errors.dockets?.[index]?.docket?.message)
                      }
                      {...register(`dockets.${index}.docket`)}
                      onInputChange={(value) =>
                        setValue(`dockets.${index}.docket`, value, {
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
                  )}
                />

                <Controller
                  control={control}
                  name="dockets"
                  render={() => (
                    <Textarea
                      label="Description"
                      placeholder="Optional description for this docket."
                      variant="faded"
                      maxLength={100}
                      description={`${watchDescription?.length} / 100`}
                      {...register(`dockets.${index}.description`)}
                    />
                  )}
                />

                <Grid size={{ xs: 12 }}>
                  <Stack direction="row" gap={2}>
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
                        onClick={() => append({ docket: "", description: "" })}
                        disabled={Boolean(errors.dockets?.[index]?.docket)}
                        sx={{
                          background: "rgba(76, 175, 80, 0.4)",
                          border: "5px double rgba(76, 175, 80, 0.3)",
                          height: 40,
                          width: 40,
                          "&:hover": { background: "rgba(76, 175, 80, 0.6)" },
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
  );
}
