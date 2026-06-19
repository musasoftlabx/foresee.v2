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
import { Input, SelectItem, Select } from "@heroui/react";

// * Components
import { HeaderFooter, ModalDialog } from "@/components/modal-dialog";

// * Store
import { useAlertDialogStore } from "@/store/useAlertDialogStore";

// * Icons
import { StoreIcon } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "../ui/shadcn/field";
import { Switch } from "../ui/shadcn/switch";

// * Schema
const schema = z
  .object({
    groups: z.array(z.string()),
    name: z.string().min(2, "Min. 2 chars.").max(30, "Max. 30 chars."),
    isGroup: z.boolean(),
    route: z.string(),
    isChild: z.boolean(),
    childOf: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isGroup && !data.route?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["route"],
        message: "Kindly specify the route.",
      });
    }

    if (data.isChild && !data.childOf?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["childOf"],
        message: "Kindly specify the parent.",
      });
    }
  });

type Schema = z.infer<typeof schema>;

export default function AddSidebarItem({
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
    getValues,
    setValue,
    reset,
    watch,
    setFocus,
  } = useForm({
    defaultValues: async () => ({
      // ? Pre-fetch groups
      groups: ["eww", "ewfew", "ewfds"],
      // groups: (await axios("groups?nameOnly=true").then(
      //   ({ data }) => data,
      // )) as Schema["groups"],

      // ? Form fields
      name: "",
      isGroup: false,
      isChild: false,
      route: "",
      childOf: "",
    }),
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // ? Effects
  useEffect(() => setFocus("name"), [setFocus]);

  // ? Form Watchers
  watch("isGroup");
  watch("isChild");

  // ? Mutations
  const { mutate: addSidebarItem } = useMutation({
    mutationFn: (body: Schema) => axios.post("sidebar-items", body),
  });

  return (
    <Fragment>
      <DevTool control={control} />

      <ModalDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title="Add Sidebar Item"
        caption="Enter sidebar item"
      >
        <form
          onSubmit={handleSubmit((formdata: Schema) =>
            addSidebarItem(formdata, {
              onSuccess: () => {
                reset();
                setIsModalOpen(false);
                queryClient.refetchQueries({ queryKey: ["sidebar-items"] });
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
                  label="Name"
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
              name="isGroup"
              render={({ field: { isGroup, isChild } }) => (
                <FieldLabel>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Is Group?</FieldTitle>
                      <FieldDescription className="text-xs">
                        Is this sidebar item a group (i.e., has child items) or
                        a single item?
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      checked={isGroup}
                      disabled={isChild}
                      onCheckedChange={(checked: boolean) => {
                        setValue("isGroup", checked, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });

                        if (checked) setValue("route", "");
                        else setValue("route", "");
                      }}
                    />
                  </Field>

                  {getValues().isGroup && (
                    <Controller
                      control={control}
                      name="route"
                      render={() => (
                        <Input
                          label="Route"
                          size="sm"
                          maxLength={30}
                          isRequired
                          variant="faded"
                          //prefix="/"
                          className="px-2 pb-2"
                          color={
                            dirty.route && !errors?.route
                              ? "success"
                              : errors.route
                                ? "danger"
                                : "default"
                          }
                          isInvalid={dirty.route && Boolean(errors.route)}
                          errorMessage={dirty.route && errors.route?.message}
                          {...register("route")}
                        />
                      )}
                    />
                  )}
                </FieldLabel>
              )}
            />

            {!getValues().isGroup && (
              <Controller
                control={control}
                name="isChild"
                render={({ field: { isGroup, isChild } }) => (
                  <FieldLabel>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>Is Child?</FieldTitle>
                        <FieldDescription className="text-xs">
                          Is this sidebar item a child of another item?
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        checked={isChild}
                        disabled={isGroup}
                        onCheckedChange={(checked: boolean) => {
                          setValue("isChild", checked, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                          if (checked) setValue("childOf", " ");
                          else setValue("childOf", "");
                        }}
                      />
                    </Field>

                    {getValues().isChild && (
                      <Controller
                        control={control}
                        name="childOf"
                        render={({ field: { childOf } }) => (
                          <Select
                            className="px-2 pb-2 max-w-xs"
                            label="Child Of (Group Name)"
                            size="sm"
                            isRequired
                            placeholder="Select a group"
                            selectedKeys={childOf}
                            variant="faded"
                            onChange={(e) =>
                              setValue(`childOf`, e.target.value, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              })
                            }
                          >
                            {getValues().groups?.map((group) => (
                              <SelectItem key={group}>{group}</SelectItem>
                            ))}
                          </Select>
                        )}
                      />
                    )}
                  </FieldLabel>
                )}
              />
            )}
          </HeaderFooter>
        </form>
      </ModalDialog>
    </Fragment>
  );
}
