"use client";

// * React
import { useEffect, useState } from "react";

// * NPM
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// * SUI
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card_";

import { useTheme } from "next-themes";

// * MUI
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

// * Components
import { TextFieldX } from "@/components/InputFields/TextFieldX";
import ButtonX from "@/components/InputFields/ButtonX";
import ThemeSwitcherX from "@/components/InputFields/ThemeSwitcherX";

import { MagicCard } from "@/components/ui/magicui/magic-card";

// * Utils
import { yupUsername, yupPassword } from "@/utils/yupReusables";

// * Icons
import { AiFillLock } from "react-icons/ai";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { RiAccountPinBoxLine } from "react-icons/ri";
import { Input } from "@heroui/react";
import __FormButton__ from "@/components/InputFields/__FormButton__";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";

import { EyeIcon } from "@/components/ui/lucide-animated/eye";
import { EyeOffIcon } from "@/components/ui/lucide-animated/eye-off";
import { FieldDescription } from "@/components/ui/shadcn/field";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { zPassword } from "@/utils/zodReusables";

// * Schema
const LoginSchema = z.object({
  username: z.string().min(2, "Name cannot be a single character"),
  password: zPassword,
});

type TLogin = z.infer<typeof LoginSchema>;

export default function Login({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
    mode: "onChange",
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const router = useRouter();
  const { theme } = useTheme();

  // ? States
  const [showPassword, setShowPassword] = useState(true);

  // ? Effects
  useEffect(() => setFocus("username"), [setFocus]);

  // ? Mutations
  const { mutate: login } = useMutation({
    mutationFn: (body: TLogin) => axios.post("login", body),
  });

  return (
    <>
      <DevTool control={control} />

      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <AnimatedThemeToggler />
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Foresee Technologies Inc.
          </a>
          <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="w-full max-w-sm border-none p-0 shadow-none">
              <MagicCard
                gradientColor={theme === "dark" ? "#262626" : "#D9D9D915"}
                className="p-0"
              >
                <CardHeader className="text-center pt-8 pb-4">
                  <CardTitle className="text-xl">Welcome back</CardTitle>
                  <CardDescription>
                    Login with your username & password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="flex flex-col gap-3 py-4"
                    onSubmit={handleSubmit(
                      (formdata: TLogin) => router.replace("/dashboard"),
                      // login(formdata, {
                      //   onSuccess: () => router.replace("/dashboard"),
                      //   onError: (error) => {
                      //     if (error instanceof AxiosError) {
                      //       // showAlert({
                      //       //   status: "error",
                      //       //   error: error.response?.data.error,
                      //       //   message: error.response?.data.message,
                      //       // });
                      //     }
                      //   },
                      // }),
                    )}
                  >
                    <Controller
                      control={control}
                      name="username"
                      render={() => (
                        <Input
                          //className="md:w-1/2 lg:w-full"
                          label="Username"
                          placeholder="Enter the username"
                          size="sm"
                          maxLength={20}
                          isRequired
                          startContent={<RiAccountPinBoxLine size={21} />}
                          color={
                            dirty.username && !errors?.username
                              ? "success"
                              : errors.username
                                ? "danger"
                                : "default"
                          }
                          isInvalid={dirty.username && Boolean(errors.username)}
                          errorMessage={
                            dirty.username && errors.username?.message
                          }
                          {...register("username")}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="password"
                      render={() => (
                        <Input
                          type={showPassword ? "password" : "text"}
                          label="Password"
                          placeholder="Enter the password"
                          size="sm"
                          maxLength={20}
                          isRequired
                          startContent={<AiFillLock size={21} />}
                          endContent={
                            <button
                              className="cursor-pointer"
                              onClick={() => setShowPassword((prev) => !prev)}
                            >
                              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                          }
                          color={
                            dirty.password && !errors?.password
                              ? "success"
                              : errors.password
                                ? "danger"
                                : "default"
                          }
                          isInvalid={dirty.password && Boolean(errors.password)}
                          errorMessage={
                            dirty.password && errors.password?.message
                          }
                          {...register("password")}
                        />
                      )}
                    />

                    <__FormButton__
                      isDisabled={!isValid || isSubmitting}
                      isLoading={isSubmitting}
                      loadingText="AUTHENTICATING..."
                      variant={!isValid || isSubmitting ? "bordered" : "shadow"}
                    >
                      LOGIN
                    </__FormButton__>
                  </form>
                </CardContent>
                <CardFooter className="border-border border-t p-4 [.border-t]:pt-4">
                  <FieldDescription className="w-full">
                    By clicking continue, you agree to our{" "}
                    <a href="#">Terms of Service</a> and{" "}
                    <a href="#">Privacy Policy</a>.
                  </FieldDescription>
                </CardFooter>
              </MagicCard>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
