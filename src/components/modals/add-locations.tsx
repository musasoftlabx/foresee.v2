// * React
// biome-ignore assist/source/organizeImports: <biome-ignore lint: false positive>
import { type Dispatch, type SetStateAction, Fragment } from "react";

// * MUI
import Grid from "@mui/material/Grid";

// * RUI
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/reui/number-field";

// * NPM
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// * Assets
import { useParams } from "next/navigation";
import { HeaderFooter, ModalDialog } from "../modal-dialog";
import { useAlertDialogStore } from "@/store/useAlertDialogStore";

// * Schema
const schema = z.object({ locations: z.number().min(1) });

type Schema = z.infer<typeof schema>;

export default function AddLocations({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { store, audit } = useParams();
  const queryClient = useQueryClient();
  const alert = useAlertDialogStore((state) => state.alert);
  const {
    control,
    formState: { isValid, isSubmitting },
    handleSubmit,
    register,
    setValue,
  } = useForm({
    defaultValues: { locations: 1 },
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // ? Mutations
  const { mutate: addLocations } = useMutation({
    mutationFn: (body: Schema) =>
      axios.post("locations", { ...body, store, audit }),
  });

  return (
    <Fragment>
      <DevTool control={control} />

      <ModalDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title="Add Location(s)"
        caption="Locations to generate"
      >
        <form
          onSubmit={handleSubmit((formdata: Schema) =>
            addLocations(formdata, {
              onSuccess: () => {
                setIsModalOpen(false);
                queryClient.refetchQueries({ queryKey: ["locations"] });
              },
              onError: (error) => {
                if (error instanceof AxiosError) {
                  alert({
                    //icon: <StoreIcon />,
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
              name="locations"
              render={() => (
                <Grid size={{ xs: 12, md: 4.5 }}>
                  <NumberField
                    {...register("locations")}
                    onValueChange={(value) => {
                      setValue("locations", value as number, {
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
                  </NumberField>
                </Grid>
              )}
            />
          </HeaderFooter>
        </form>
      </ModalDialog>
    </Fragment>
  );
}
