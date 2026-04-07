// * React
// biome-ignore assist/source/organizeImports: <biome-ignore lint: false positive>
import { type Dispatch, Fragment, type SetStateAction, useEffect } from "react";

// * NPM
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// * HUI
import { Input } from "@heroui/react";

// * Components
import { HeaderFooter, ModalDialog } from "@/components/modal-dialog";

// * Store
import { useAlertDialogStore } from "@/store/useAlertDialogStore";

// * Icons
import { StoreIcon } from "lucide-react";

// * Schema
const schema = z.object({
  name: z.string().min(2, "Client cannot be a single character"),
});

type Schema = z.infer<typeof schema>;

export default function AddClient({
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
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  // ? Hooks
  const queryClient = useQueryClient();

  // ? Effects
  useEffect(() => setFocus("name"), [setFocus]);

  // ? State Actions
  const alert = useAlertDialogStore((state) => state.alert);

  // ? Mutations
  const { mutate: addClient } = useMutation({
    mutationFn: (body: Schema) => axios.post("clients", body),
  });

  return (
    <Fragment>
      <DevTool control={control} />

      <ModalDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title="Add Client"
        caption="Enter the client name"
      >
        <form
          onSubmit={handleSubmit((formdata: Schema) =>
            addClient(formdata, {
              onSuccess: () => {
                reset();
                setIsModalOpen(false);
                queryClient.refetchQueries({
                  queryKey: ["clients"],
                });
              },
              onError: (error) => {
                if (error instanceof AxiosError) {
                  alert({
                    icon: <StoreIcon />,
                    status: "error",
                    subject: error.response?.data.error,
                    body: error.response?.data.message,
                  });
                }
              },
            }),
          )}
        >
          <HeaderFooter
            isSubmitting={isSubmitting}
            isValid={isValid}
            setIsModalOpen={setIsModalOpen}
            hideFooterCloseButton
          >
            <Controller
              control={control}
              name="name"
              render={() => (
                <Input
                  label="Client Name"
                  size="sm"
                  maxLength={20}
                  isRequired
                  variant="faded"
                  color={
                    dirty.name && !errors?.name
                      ? "success"
                      : errors.name
                        ? "danger"
                        : "default"
                  }
                  isInvalid={dirty.name && Boolean(errors.name)}
                  errorMessage={dirty.name && errors.name?.message}
                  {...register("name")}
                />
              )}
            />
          </HeaderFooter>
        </form>
      </ModalDialog>
    </Fragment>
  );
}
