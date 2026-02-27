// * React
import { RefObject, SetStateAction, useEffect, useRef } from "react";

// * SUI
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";

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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

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

// * Assets
import countries from "../../../../public/data/countries.json";
import { HeroTelInput, matchIsValidTel } from "@hyperse/hero-tel-input";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/navigation";

type TSchema = z.infer<typeof schema>;

export default function CreateStore({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
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
      firstName: "",
      lastName: "",
      emailAddress: "",
      phoneNumber: "",
    }),
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // ? Hooks
  const queryClient = useQueryClient();
  const router = useRouter();

  // ? Effects
  useEffect(() => setFocus("firstName"), [setFocus]);

  // ? Query
  const { data: countryData } = useQuery({
    queryKey: ["country"],
    queryFn: () => axios.get("https://api.country.is/"),
    select: ({ data }) => data,
  });

  // ? Mutations
  const { mutate: createAccount } = useMutation({
    mutationFn: (body: TSchema) => axios.post("register", body),
  });

  const { onOpen, onOpenChange } = useDisclosure();
  const targetRef = useRef<RefObject<HTMLElement> | any>(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  return (
    <>
      <DevTool control={control} />

      <Modal
        ref={targetRef}
        backdrop="blur"
        shadow="lg"
        isOpen={true}
        onClose={() => setIsOpen(false)}
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
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader {...moveProps} className="flex flex-col gap-1">
                Create Account
                <p className="text-xs text-muted-foreground">
                  Enter account details
                </p>
              </ModalHeader>

              <form
                onSubmit={handleSubmit((formdata: TSchema) =>
                  createAccount(formdata, {
                    onSuccess: () => {
                      router.push("/portal/stores");
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
                            isInvalid={
                              dirty.firstName && Boolean(errors.firstName)
                            }
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
                            isInvalid={
                              dirty.lastName && Boolean(errors.lastName)
                            }
                            errorMessage={
                              dirty.lastName && errors.lastName?.message
                            }
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
                  </Grid>
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
