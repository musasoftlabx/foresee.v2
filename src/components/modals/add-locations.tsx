// * React
import React, { Fragment, RefObject, SetStateAction, useRef } from "react";

// * MUI
import Grid from "@mui/material/Grid";

// * SUI

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/shadcn/scroll-area";

// * RUI
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
  Alert,
} from "@heroui/react";

// * Components
import __DatePicker__ from "@/components/InputFields/__DatePicker__";
import __FileUploader__ from "@/components/InputFields/FileUploader";
import { XIcon } from "@/components/ui/lucide-animated/x";

// * NPM
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// * Icons
import { ExternalLink, X } from "lucide-react";

// * Assets
import { useParams } from "next/navigation";

// * Schema
const schema = z.object({
  locations: z.number().min(1),
});

type TSchema = z.infer<typeof schema>;

export default function CreateAudit({
  isAddItemOpen,
  setIsAddItemOpen,
}: {
  isAddItemOpen: boolean;
  setIsAddItemOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { store, audit } = useParams();

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
      locations: 1,
    }),
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // ? Hooks
  const queryClient = useQueryClient();

  // ? Mutations
  const { mutate: addLocations } = useMutation({
    mutationFn: (body: TSchema) =>
      axios.post("locations", { ...body, store, audit }),
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const targetRef = useRef<RefObject<HTMLElement> | any>(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  return (
    <Fragment>
      <DevTool control={control} />

      <Modal
        ref={targetRef}
        backdrop="blur"
        shadow="lg"
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onOpenChange={onOpenChange}
        draggable={false}
        isDismissable={false}
        closeButton={
          <div>
            <X className="size-5 mt-2 mr-1 hover:rotate-90 transition-transform duration-500 ease-in-out" />
          </div>
        }
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
              <ModalHeader {...moveProps} className="flex flex-col">
                Add Location(s)
                <p className="text-xs text-muted-foreground">
                  Enter location count to generate
                </p>
              </ModalHeader>

              <form
                onSubmit={handleSubmit((formdata: TSchema) =>
                  addLocations(formdata, {
                    onSuccess: () => {
                      setIsAddItemOpen(false);
                      queryClient.refetchQueries({ queryKey: ["locations"] });
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
                <ScrollArea type="auto" className="max-h-[50vh]">
                  <ModalBody>
                    <Grid container spacing={1}>
                      <Controller
                        control={control}
                        name="locations"
                        render={() => (
                          <Grid size={{ xs: 12, md: 4.5 }}>
                            <NumberField
                              {...register("locations")}
                              onValueChange={(value) => {
                                setValue("locations", value!, {
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
                                <NumberFieldInput />
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
                  </ModalBody>
                  <ScrollBar />
                </ScrollArea>

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
    </Fragment>
  );
}
