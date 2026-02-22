"use client";

// * React
import { useEffect, useState } from "react";

// * Next
import { useParams, useRouter } from "next/navigation";

// * NPM
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
//import { InferType, object } from "yup";
import { object } from "zod";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import axios, { AxiosError } from "axios";

import { useMask } from "@react-input/mask";

// * MUI
import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";

// * Components
import { TextFieldX } from "@/components/InputFields/TextFieldX";
import ButtonX from "@/components/InputFields/ButtonX";

// * Utils
//import { yupUsername, yupPasscode } from "@/utils/zodReusables";

// * Icons
import { AiFillLock } from "react-icons/ai";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useAlertStore } from "@/store/useAlertStore";

const idSchema = object({ authId: {} /* yupUsername */ });
const passcodeSchema = object({ passcode: {} /* yupPasscode */ });

type Login = {}; //InferType<typeof idSchema>;
type Passcode = {}; //InferType<typeof passcodeSchema>;
type Ballot = {
  authType: string;
  name: string;
  logo: string;
  color: string;
  backdrop: string;
  infographic: string;
};

//import Ballot from "./server";

export default function SignIn({ children }: { children: Ballot }) {
  const [currentForm, setCurrentForm] = useState<"authorization" | "sign-in">(
    "authorization"
  );

  const showAlert = useAlertStore((state) => state.alert);

  const { ballot } = useParams();

  const router = useRouter();

  const { data } = useQuery({
    queryKey: [ballot],
    queryFn: ({ queryKey }) => axios<Ballot>(`${queryKey[0]}`),
    select: ({ data }) => data,
  });

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   setFocus,
  //   formState: { errors, isValid, isSubmitting, dirtyFields: dirty },
  // } = useForm({
  //   mode: "onChange",
  //   resolver: yupResolver(idSchema),
  // });

  const idForm = useForm({
    mode: "onChange",
    resolver: yupResolver(idSchema),
  });

  const passcodeForm = useForm({
    mode: "onChange",
    resolver: yupResolver(passcodeSchema),
  });

  // ? States
  const [showPasscode, setShowPasscode] = useState(true);

  // ? Effects
  useEffect(() => idForm.setFocus("authId"), [idForm.setFocus]);

  // ? Mutations
  const { mutate: authorize } = useMutation({
    mutationFn: (body: Login) => axios.post(`${ballot}/authorize`, body),
  });

  const { mutate: signIn } = useMutation({
    mutationFn: (body: Passcode) => axios.post(`${ballot}/sign-in`, body),
  });

  return (
    <Box
    // sx={[
    //   {
    //     background:
    //       "linear-gradient(to left, rgba(216, 247, 195, .9) 0%, rgba(222, 236, 221, .9) 100%);",
    //   },
    //   (theme) =>
    //     theme.applyStyles("dark", {
    //       background:
    //         "linear-gradient(293deg, rgba(41, 179, 74, .9) 0%, rgba(0, 0, 0, .9) 70%);",
    //     }),
    // ]}
    >
      <Box
        sx={[
          {
            //filter: "invert(0)",
            filter: "blur(50px)",
            height: "100vh",
            objectFit: "cover",
            position: "fixed",
            width: "100vw",
            zIndex: -1,
          },
          (theme) =>
            theme.applyStyles("dark", {
              filter: "invert(1) hue-rotate(260deg)",
            }),
        ]}
      >
        <img
          //src="http://75.119.137.255:3333/usiu26se/bg.jpg"
          src="http://75.119.137.255:3333/bg.webp"
          alt="background"
          style={{
            height: "100vh",
            objectFit: "cover",
            objectPosition: "50% 50%",
            position: "fixed",
            width: "100vw",
            zIndex: -1,
          }}
        />
      </Box>

      <Grid container minHeight="100vh">
        <Grid
          size={12}
          direction="column"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: [0, 0.71, 0.2, 1.01],
              scale: {
                type: "spring",
                damping: 5,
                stiffness: 100,
                restDelta: 0.001,
              },
            }}
          >
            <Stack
              borderRadius={7}
              direction="row"
              spacing={3}
              pl={3}
              sx={[
                {
                  background: "rgba(255, 255, 255, 0.5)",
                  boxShadow:
                    "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                  overflow: "hidden",
                },
                (theme) =>
                  theme.applyStyles("dark", {
                    background: "rgba(0, 0, 0, 0.5)",
                  }),
              ]}
            >
              <Stack width={340}>
                <img
                  src={children?.logo}
                  alt="logo"
                  style={{ height: 150, width: 150, objectFit: "contain" }}
                />

                <Typography
                  fontFamily="Rubik"
                  fontSize={24}
                  fontWeight={600}
                  textAlign="center"
                  mt={currentForm === "authorization" ? 3 : 0}
                  sx={{
                    color: children?.color || "primary",
                    // textDecoration: "underline",
                    // textDecorationStyle: "wavy",
                    // textDecorationThickness: 1,
                  }}
                >
                  {/* {children?.name} */}
                  Mr & Miss USIU 2026
                </Typography>

                {currentForm === "authorization" && (
                  <form
                    onSubmit={idForm.handleSubmit((formdata: Login) =>
                      authorize(formdata, {
                        onSuccess: ({ data }) => setCurrentForm("sign-in"),
                        onError: (error: Error | AxiosError) => {
                          if (axios.isAxiosError(error)) {
                            showAlert({
                              status: "error",
                              subject: error.response?.data.subject,
                              body: error.response?.data.body,
                            });
                          }
                        },
                      })
                    )}
                  >
                    <Typography
                      variant="subtitle2"
                      textAlign="center"
                      mx={4}
                      my={1}
                    >
                      Start by entering your {children?.authType}
                    </Typography>

                    <Controller
                      name="authId"
                      control={idForm.control}
                      render={({ field }) => (
                        <TextFieldX
                          {...field}
                          label={`${children?.authType} *`}
                          //mask="####"
                          error={
                            idForm.formState.dirtyFields.authId &&
                            Boolean(idForm.formState.errors.authId?.message)
                          }
                          helperText={
                            idForm.formState.dirtyFields.authId &&
                            idForm.formState.errors.authId?.message
                          }
                          loading={idForm.formState?.isSubmitting}
                          columnspan={{ xs: 12 }}
                          circularedge={20}
                          slotprops={{ htmlInput: { maxLength: 20 } }}
                          {...idForm.register("authId")}
                        />
                      )}
                    />

                    <ButtonX
                      variant="contained"
                      placement="center"
                      size="large"
                      disabled={
                        !idForm.formState.isValid ||
                        idForm.formState.isSubmitting
                      }
                      loading={idForm.formState.isSubmitting}
                      loadingtext="AUTHORIZING..."
                      sx={{
                        bgcolor: children?.color || "text.primary",
                        borderColor: children?.color || "text.primary",
                      }}
                    >
                      AUTHORIZE
                    </ButtonX>
                  </form>
                )}

                {currentForm === "sign-in" && (
                  <form
                    onSubmit={passcodeForm.handleSubmit((formdata: Passcode) =>
                      signIn(formdata, {
                        onSuccess: ({ data }) =>
                          router.replace(`${ballot}/dockets`),
                      })
                    )}
                  >
                    <Typography
                      variant="subtitle2"
                      textAlign="center"
                      mx={4}
                      my={1}
                    >
                      We sent a passcode to +254 *** ***160. Enter the passcode
                      received. Incase you didn't receive the passcode, click
                      here to send a passcode to your email instead.
                    </Typography>

                    <Controller
                      name="passcode"
                      control={passcodeForm.control}
                      render={({ field }) => (
                        <TextFieldX
                          {...field}
                          type={showPasscode ? "passcode" : "text"}
                          label="Passcode *"
                          error={
                            passcodeForm.formState.dirtyFields.passcode &&
                            Boolean(
                              passcodeForm.formState.errors.passcode?.message
                            )
                          }
                          helperText={
                            passcodeForm.formState.dirtyFields.passcode &&
                            passcodeForm.formState.errors.passcode?.message
                          }
                          prefixcon={<AiFillLock size={24} />}
                          suffixcon={
                            <IconButton
                              onClick={() => setShowPasscode((prev) => !prev)}
                              onMouseDown={(event) => event.preventDefault()}
                              edge="end"
                              sx={{
                                color: passcodeForm.formState.errors.passcode
                                  ? "#d3302f"
                                  : "",
                              }}
                            >
                              {showPasscode ? (
                                <MdVisibility />
                              ) : (
                                <MdVisibilityOff />
                              )}
                            </IconButton>
                          }
                          columnspan={{ xs: 12 }}
                          slotprops={{ htmlInput: { maxLength: 20 } }}
                          {...passcodeForm.register("passcode")}
                        />
                      )}
                    />

                    <ButtonX
                      variant="contained"
                      placement="center"
                      size="large"
                      disabled={
                        !passcodeForm.formState.isValid ||
                        passcodeForm.formState.isSubmitting
                      }
                      loading={passcodeForm.formState.isSubmitting}
                      loadingtext="LET'S GO..."
                    >
                      LOGIN
                    </ButtonX>
                  </form>
                )}
              </Stack>

              <Stack height={500} width={350}>
                <img
                  //src={children?.infographic}
                  src="http://75.119.137.255:3333/infographic.png"
                  alt="background"
                  style={{
                    filter: "hue-rotate(260deg)",
                    height: "600px",
                    objectFit: "cover",
                    objectPosition: "30% 50%",
                    opacity: 0.7,
                  }}
                />
              </Stack>
            </Stack>
          </motion.div>
        </Grid>
      </Grid>

      <DevTool control={idForm.control} />
    </Box>
  );
}
