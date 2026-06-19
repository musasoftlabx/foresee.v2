// * React
// biome-ignore assist/source/organizeImports: <biome-ignore lint: false positive>
import { type Dispatch, type SetStateAction, useEffect } from "react";

// * Next
import { useRouter } from "next/navigation";
import Image from "next/image";

// * HUI
import { Input } from "@heroui/react";

// * RUI
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/reui/tabs";

// * NPM
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { GoogleLogin } from "@react-oauth/google";
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

// * Icons
import { useAlertDialogStore } from "@/store/useAlertDialogStore";

// * Schema
const schema = z.object({
  emailAddress: z.email("Invalid email."),
  password: zPassword,
});

type Schema = z.infer<typeof schema>;

export default function Login({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    control,
    formState: { errors, isValid, isSubmitting, dirtyFields: dirty },
    handleSubmit,
    register,
    setFocus,
  } = useForm({
    defaultValues: { emailAddress: "", password: "" },
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // ? Hooks
  const alert = useAlertDialogStore((state) => state.alert);
  const router = useRouter();

  const { theme } = useTheme();

  // ? Effects
  useEffect(() => setFocus("emailAddress"), [setFocus]);

  // ? Mutations
  const { mutate: login } = useMutation({
    mutationFn: (body: Schema) => axios.post("login", body),
  });

  const { mutate: signInWithGoogle } = useMutation({
    mutationFn: (token?: string) =>
      axios.post("login", { type: "google", token }),
  });

  return (
    <>
      <DevTool control={control} />

      <ModalDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title="Login"
        caption="Welcome back! let's sign you in."
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
            login(
              {
                ...formdata,
                password: Buffer.from(formdata.password).toString("base64"),
              },
              {
                onSuccess: () => {
                  //router.push("/portal");
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
              },
            );
          })}
        >
          <HeaderFooter
            isSubmitting={isSubmitting}
            isValid={isValid}
            setIsModalOpen={setIsModalOpen}
            submitText="Login"
            hideFooterCloseButton
          >
            <Tabs
              defaultValue="staff"
              className="text-sm text-muted-foreground"
            >
              <TabsList className="grid w-full grid-cols-2 mb-5 border-1">
                <TabsTrigger value="staff">Organization</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
              </TabsList>

              <TabsContent value="staff">
                <GoogleLogin
                  onSuccess={({ credential }) => {
                    signInWithGoogle(credential, {
                      onSuccess: () => router.push("/portal"),
                      //onSuccess: () => {},
                      onError: (error) => {
                        if (error instanceof AxiosError) {
                          alert({
                            subject: "Google Sign-In Failed",
                            body: "An error occurred during Google Sign-In. Please try again.",
                          });
                        }
                      },
                    });
                  }}
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
                />

                <FieldSeparator className="[&>span]:bg-sidebar! my-3 text-transparent">
                  Or login by filling these details
                </FieldSeparator>

                <Grid container spacing={1}>
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
                          errorMessage={
                            dirty.password && errors.password?.message
                          }
                          {...register(`password`)}
                        />
                      </Grid>
                    )}
                  />

                  <FieldDescription className="pt-4 pb-2 px-6 text-center">
                    By signing in, you agree to our{" "}
                    <a href="/">Terms of Service</a> and{" "}
                    <a href="/">Privacy Policy</a>.
                  </FieldDescription>
                </Grid>
              </TabsContent>
              <TabsContent value="members">
                <Grid container spacing={1}>
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
                          errorMessage={
                            dirty.password && errors.password?.message
                          }
                          {...register(`password`)}
                        />
                      </Grid>
                    )}
                  />

                  <FieldDescription className="pt-4 pb-2 px-6 text-center">
                    By signing in, you agree to our{" "}
                    <a href="/">Terms of Service</a> and{" "}
                    <a href="/">Privacy Policy</a>.
                  </FieldDescription>
                </Grid>
              </TabsContent>
            </Tabs>
          </HeaderFooter>
        </form>
      </ModalDialog>
    </>
  );
}
