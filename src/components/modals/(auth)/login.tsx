// * React
import { Dispatch, SetStateAction, useEffect } from "react";

// * Next
import { useRouter } from "next/navigation";

// * HUI
import { Input } from "@heroui/react";

// * NPM
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "next-themes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Grid from "@mui/material/Grid";

// * Components
import { FieldDescription, FieldSeparator } from "../../ui/shadcn/field";
import { HeaderFooter, ModalDialog } from "../../modal-dialog";

// * Utils
import { zPassword } from "../../../utils/zodReusables";

// * Icons
import { GalleryVerticalEnd } from "lucide-react";

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
    reset,
  } = useForm({
    defaultValues: { emailAddress: "", password: "" },
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // ? Hooks
  const queryClient = useQueryClient();
  const router = useRouter();

  const { theme } = useTheme();

  // ? Effects
  useEffect(() => setFocus("emailAddress"), [setFocus]);

  // ? Mutations
  const { mutate: login } = useMutation({
    mutationFn: (body: Schema) => axios.post("login", body),
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
        logo={<GalleryVerticalEnd className="size-8 mb-1" />}
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
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
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
                      errorMessage={dirty.password && errors.password?.message}
                      {...register(`password`)}
                    />
                  </Grid>
                )}
              />

              <FieldDescription className="pt-4 pb-2 px-6 text-center">
                By signing in, you agree to our <a href="/">Terms of Service</a>{" "}
                and <a href="/">Privacy Policy</a>.
              </FieldDescription>
            </Grid>
          </HeaderFooter>
        </form>
      </ModalDialog>
    </>
  );
}
