// * React
import { Dispatch, type SetStateAction, useEffect } from "react";

// * Next
import { useRouter } from "next/navigation";
import Image from "next/image";

// * HUI
import { Input } from "@heroui/react";

// * NPM
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { GoogleLogin } from "@react-oauth/google";
import { HeroTelInput, matchIsValidTel } from "@hyperse/hero-tel-input";
import { useTheme } from "next-themes";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Grid from "@mui/material/Grid";

// * Components
import { FieldDescription, FieldSeparator } from "../../ui/shadcn/field";
import { HeaderFooter, ModalDialog } from "../../modal-dialog";

// * Utils
import { zPassword } from "../../../utils/zodReusables";

// * Schema
const schema = z
  .object({
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
    password: zPassword,
    confirm: zPassword,
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
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
      password: "",
      confirm: "",
    },
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // ? Hooks
  const { theme } = useTheme();
  const router = useRouter();

  // ? Effects
  useEffect(() => setFocus("firstName"), [setFocus]);

  // ? Mutations
  const { mutate: signUp } = useMutation({
    mutationFn: (body: Schema) => axios.post("register", body),
  });

  const { mutate: signUpWithGoogle } = useMutation({
    mutationFn: (token?: string) =>
      axios.post("register", { type: "google", token }),
  });

  return (
    <>
      <DevTool control={control} />

      <ModalDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title="Create Account"
        caption="Enter account details"
        centerHeader
        logo={
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="invert mb-2"
          />
        }
        onClose={() => router.replace("/")}
      >
        <form
          onSubmit={handleSubmit((formdata: Schema) => {
            signUp(
              {
                ...formdata,
                password: Buffer.from(formdata.password).toString("base64"),
              },
              {
                onSuccess: () => router.push("/portal"),
                onError: (error) => {
                  if (error instanceof AxiosError) {
                    // showAlert({
                    //   status: "error",
                    //   error: error.response?.data.error,
                    //   message: error.response?.data.message,
                    // });
                  }
                },
              },
            );
          })}
        >
          <HeaderFooter
            isSubmitting={isSubmitting}
            isValid={isValid}
            setIsModalOpen={setIsModalOpen}
            submitText="Create"
            hideFooterCloseButton
          >
            <GoogleLogin
              onSuccess={({ credential }) =>
                signUpWithGoogle(credential, {
                  onSuccess: () => router.push("/portal"),
                  onError: (error) => {
                    if (error instanceof AxiosError) {
                      alert({
                        subject: "Google Sign-In Failed",
                        body: "An error occurred during Google Sign-In. Please try again.",
                      });
                    }
                  },
                })
              }
              onError={() =>
                alert({
                  subject: "Google Sign-In Failed",
                  body: "An error occurred during Google Sign-In. Please try again.",
                })
              }
              useOneTap
              auto_select
              theme={theme === "dark" ? "filled_black" : "outline"}
              shape="pill"
              logo_alignment="left"
              text="signup_with"
            />

            <FieldSeparator className="[&>span]:bg-sidebar! my-3 text-transparent">
              Or create an account by filling these details
            </FieldSeparator>

            <Grid container spacing={1}>
              <Controller
                control={control}
                name={`firstName`}
                render={() => (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Input
                      label="First Name"
                      variant="faded"
                      //className="md:w-1/2"
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
                render={({ field, fieldState }) => {
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

              <Controller
                control={control}
                name="password"
                render={() => (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Input
                      label="Password"
                      variant="faded"
                      maxLength={20}
                      isRequired
                      size="sm"
                      color={
                        dirty.password && !errors.password
                          ? "success"
                          : errors.password
                            ? "danger"
                            : "default"
                      }
                      isInvalid={dirty.password && Boolean(errors.password)}
                      errorMessage={dirty.password && errors.password?.message}
                      {...register(`password`)}
                    />
                  </Grid>
                )}
              />

              <Controller
                control={control}
                name="confirm"
                render={() => (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Input
                      label="Confirm Password"
                      variant="faded"
                      maxLength={20}
                      isRequired
                      size="sm"
                      color={
                        dirty.confirm && !errors.confirm
                          ? "success"
                          : errors.confirm
                            ? "danger"
                            : "default"
                      }
                      isInvalid={dirty.confirm && Boolean(errors.confirm)}
                      errorMessage={dirty.confirm && errors.confirm?.message}
                      {...register(`confirm`)}
                    />
                  </Grid>
                )}
              />

              <FieldDescription className="pt-4 pb-2 px-6 text-center">
                By signing up, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
              </FieldDescription>
            </Grid>
          </HeaderFooter>
        </form>
      </ModalDialog>
    </>
  );
}
