// * React
import { type Dispatch, Fragment, type SetStateAction, useEffect } from "react";

// * NPM
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// * HUI
import { Input, Textarea } from "@heroui/react";

// * Components
import { HeaderFooter, ModalDialog } from "@/components/modal-dialog";

// * Store
import { useAlertDialogStore } from "@/store/useAlertDialogStore";

// * Icons
import { StoreIcon } from "lucide-react";

// * Schema
const schema = z.object({
  name: z.string().min(2, "Min. 2 chars.").max(50, "Max. 50 chars."),
  description: z.string(),
});

type Schema = z.infer<typeof schema>;

export default function CreateOrganization({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();
  const alert = useAlertDialogStore((state) => state.alert);
  const {
    control,
    formState: { errors, isLoading, isValid, isSubmitting, dirtyFields: dirty },
    handleSubmit,
    register,
    setFocus,
  } = useForm({
    defaultValues: { name: "", description: "" },
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // ? Effects
  useEffect(() => setFocus("name"), [setFocus]);

  // ? Mutations
  const { mutate: createOrganization } = useMutation({
    mutationFn: (body: Schema) => axios.post("organizations", body),
  });

  return (
    <Fragment>
      <DevTool control={control} />

      <ModalDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title="Create Organization"
        caption="Enter organization details"
      >
        <form
          onSubmit={handleSubmit((formdata: Schema) =>
            createOrganization(formdata, {
              onSuccess: () => {
                setIsModalOpen(false);
                queryClient.refetchQueries({
                  queryKey: ["organizations"],
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
          >
            <Controller
              control={control}
              name="name"
              render={() => (
                <Input
                  label="Organization Name"
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

            <Controller
              control={control}
              name="description"
              render={() => (
                <Textarea
                  description="Enter a concise description of your organization (Optional)."
                  label="Description (Optional)"
                  placeholder="Enter organization description"
                  variant="faded"
                />
              )}
            />
          </HeaderFooter>
        </form>
      </ModalDialog>
    </Fragment>
  );
}
