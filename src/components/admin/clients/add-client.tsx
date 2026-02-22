// * Components
import { Button as Batton } from "@/components/ui/button";
import { Button } from "@heroui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";

// * NPM
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { zPassword } from "@/utils/zodReusables";
import { Input } from "@heroui/react";
import { SetStateAction, useEffect } from "react";

// * Schema
const ClientSchema = z.object({
  client: z.string().min(2, "Client cannot be a single character"),
});

type TClient = z.infer<typeof ClientSchema>;

export function AddClient({
  isAddClientOpen,
  setIsAddClientOpen,
}: {
  isAddClientOpen: boolean;
  setIsAddClientOpen: React.Dispatch<SetStateAction<boolean>>;
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
    mode: "onChange",
    resolver: zodResolver(ClientSchema),
    defaultValues: { client: "" },
  });

  const queryClient = useQueryClient();

  // ? Effects
  useEffect(() => setFocus("client"), [setFocus]);

  // ? Mutations
  const { mutate: addClient } = useMutation({
    mutationFn: (body: TClient) => axios.post("clients", body),
  });

  return (
    <>
      <DevTool control={control} />

      <Dialog open={isAddClientOpen}>
        {/* <DialogTrigger asChild>{children}</DialogTrigger> */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Client</DialogTitle>
            <DialogDescription>Enter the client name.</DialogDescription>
          </DialogHeader>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit((formdata: TClient) =>
              addClient(formdata, {
                onSuccess: () => {
                  setIsAddClientOpen(false);
                  queryClient.refetchQueries({
                    queryKey: ["clients"],
                  });
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
            <Controller
              control={control}
              name="client"
              render={() => (
                <Input
                  //className="md:w-1/2 lg:w-full"
                  label="Client Name"
                  placeholder="Enter the client name"
                  size="sm"
                  maxLength={20}
                  isRequired
                  variant="faded"
                  //startContent={<RiAccountPinBoxLine size={21} />}
                  color={
                    dirty.client && !errors?.client
                      ? "success"
                      : errors.client
                        ? "danger"
                        : "default"
                  }
                  isInvalid={dirty.client && Boolean(errors.client)}
                  errorMessage={dirty.client && errors.client?.message}
                  {...register("client")}
                />
              )}
            />

            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button
                  variant="bordered"
                  size="sm"
                  onPress={() => setIsAddClientOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="solid"
                size="sm"
                disabled={isLoading || isSubmitting || !isValid}
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
