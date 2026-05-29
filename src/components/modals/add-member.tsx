// * React
// biome-ignore assist/source/organizeImports: <biome-ignore lint: false positive>
import { type Dispatch, type SetStateAction, useEffect } from "react";

// * Next
import { useRouter } from "next/navigation";

// * HUI
import { Input } from "@heroui/react";

// * NPM
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { HeroTelInput, matchIsValidTel } from "@hyperse/hero-tel-input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Grid from "@mui/material/Grid";

// * Components
import { HeaderFooter, ModalDialog } from "../modal-dialog";

// * Icons
import { UsersRound } from "lucide-react";

// * Schema
const schema = z.object({
  firstName: z.string().min(2, "Name cannot be a single character"),
  lastName: z.string().min(2, "Name cannot be a single character"),
  emailAddress: z.email("Invalid email."),
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
});

type Schema = z.infer<typeof schema>;

import { useAlertDialogStore } from "@/store/useAlertDialogStore";

export default function CreateAccount({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  // ? Hooks
  const alert = useAlertDialogStore((state) => state.alert);

  const queryClient = useQueryClient();

  const {
    control,
    formState: { errors, isValid, isSubmitting, dirtyFields: dirty },
    handleSubmit,
    register,
    setFocus,
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      phoneNumber: "",
    },
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // ? Hooks
  const router = useRouter();

  // ? Effects
  useEffect(() => setFocus("firstName"), [setFocus]);

  // ? Mutations
  const { mutate: addMember } = useMutation({
    mutationFn: (body: Schema) => axios.post("members", body),
  });

  return (
    <>
      <DevTool control={control} />

      <ModalDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title="Add team member"
        caption="Enter team member details"
        logo={<UsersRound className="size-8 mb-1" />}
        onClose={() => router.replace("/")}
      >
        <form
          onSubmit={handleSubmit((formdata: Schema) => {
            addMember(formdata, {
              onSuccess: () => {
                reset();
                setIsModalOpen(false);
                queryClient.refetchQueries({ queryKey: ["members"] });
              },
              onError: (error) => {
                if (error instanceof AxiosError) {
                  alert({
                    icon: <UsersRound />,
                    status: "error",
                    subject: error.response?.data.error,
                    body: error.response?.data.message,
                  });
                }
              },
            });
          })}
        >
          <HeaderFooter
            isSubmitting={isSubmitting}
            isValid={isValid}
            setIsModalOpen={setIsModalOpen}
            submitText="Create"
            hideFooterCloseButton
          >
            <Grid container spacing={1}>
              <Controller
                control={control}
                name={`firstName`}
                render={() => (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Input
                      label="First Name"
                      variant="faded"
                      maxLength={20}
                      isRequired
                      size="sm"
                      color={
                        dirty.firstName && !errors.firstName
                          ? "success"
                          : errors.firstName
                            ? "danger"
                            : "default"
                      }
                      isInvalid={dirty.firstName && Boolean(errors.firstName)}
                      errorMessage={
                        dirty.firstName && errors.firstName?.message
                      }
                      {...register(`firstName`)}
                    />
                  </Grid>
                )}
              />

              <Controller
                control={control}
                name={`lastName`}
                render={() => (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Input
                      label="Last Name"
                      variant="faded"
                      size="sm"
                      maxLength={20}
                      isRequired
                      color={
                        dirty.lastName && !errors.lastName
                          ? "success"
                          : errors.lastName
                            ? "danger"
                            : "default"
                      }
                      isInvalid={dirty.lastName && Boolean(errors.lastName)}
                      errorMessage={dirty.lastName && errors.lastName?.message}
                      {...register(`lastName`)}
                    />
                  </Grid>
                )}
              />

              <Controller
                control={control}
                name="emailAddress"
                render={() => (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Input
                      label="Email Address"
                      size="sm"
                      isRequired
                      color={
                        dirty.emailAddress && !errors?.emailAddress
                          ? "success"
                          : errors.emailAddress
                            ? "danger"
                            : "default"
                      }
                      isInvalid={
                        dirty.emailAddress && Boolean(errors.emailAddress)
                      }
                      errorMessage={
                        dirty.emailAddress && errors.emailAddress?.message
                      }
                      {...register("emailAddress")}
                    />
                  </Grid>
                )}
              />

              <Controller
                control={control}
                name={`phoneNumber`}
                render={({ field }) => {
                  return (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <HeroTelInput
                        {...field}
                        label="Phone Number"
                        variant="faded"
                        className="[&_span]:w-6.25 [&_span]:mt-3 [&_span]:-ml-3 [&_input[type=tel]]:-mb-0.5 [&_input[type=tel]]:-ml-2"
                        size="sm"
                        //defaultCountry={countryData?.country || "KE"}
                        defaultCountry={"KE"}
                        maxLength={20}
                        isRequired
                        color={
                          dirty.phoneNumber && !errors.phoneNumber
                            ? "success"
                            : errors.phoneNumber
                              ? "danger"
                              : "default"
                        }
                        isInvalid={
                          dirty.phoneNumber &&
                          Boolean(errors.phoneNumber?.message)
                        }
                        errorMessage={errors.phoneNumber?.message}
                      />
                    </Grid>
                  );
                }}
              />
            </Grid>
          </HeaderFooter>
        </form>
      </ModalDialog>
    </>
  );
}
