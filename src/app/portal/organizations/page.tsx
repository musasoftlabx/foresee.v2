"use client";

// * React
// biome-ignore assist/source/organizeImports: <biome-ignore lint: false positive>
import { Fragment, useState } from "react";

// * NPM
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// * Components
import CreateOrganization from "@/components/modals/create-organization";

// * Store
import { useConfirmDialogStore } from "@/store/useConfirmDialogStore";

// * Types
import { Card, CardContent, CardFooter } from "@/components/ui/shadcn/card";
import {
  ArrowLeftIcon,
  HomeIcon,
  PlusIcon,
  SquareTerminalIcon,
  Trash2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/shadcn/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import { Button } from "@/components/ui/shadcn/button";
import { Field, FieldLabel } from "@/components/ui/shadcn/field";
import { Separator } from "@/components/ui/shadcn/separator";
import { Switch } from "@/components/ui/shadcn/switch";
import { AnimatedThemeToggler } from "@/components/ui/magicui/animated-theme-toggler";
import { useAlertDialogStore } from "@/store/useAlertDialogStore";
import { GoTrash } from "react-icons/go";
import { addToast } from "@heroui/react";

import ConfirmDialog from "@/components/confirm-dialog";

export default function Organizations({ apiUrl = "organizations" }) {
  // ? States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    number | null
  >(null);

  const queryClient = useQueryClient();
  const alert = useAlertDialogStore((state) => state.alert);
  const action = useConfirmDialogStore((state) => state.action);
  const confirm = useConfirmDialogStore((state) => state.confirm);
  const closeConfirm = useConfirmDialogStore((state) => state.close);

  // ? Queries
  const { data, isLoading } = useQuery({
    queryKey: [apiUrl],
    queryFn: ({ queryKey }) => axios(queryKey[0]),
    select: ({
      data,
    }: {
      data: {
        id: number;
        name: string;
        details: { label: string; value: string }[];
        isActive: boolean;
      }[];
    }) => data,
  });

  // ? Mutations
  const { mutate: deleteOrganization } = useMutation({
    mutationFn: (body: { id: number }) =>
      axios.delete("organizations", { data: body }),
  });

  return (
    <Fragment>
      <CreateOrganization
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <ConfirmDialog
        handleConfirm={() => {
          closeConfirm();
          switch (action) {
            case "delete":
              deleteOrganization(
                { id: selectedOrganizationId as number },
                {
                  onSuccess: () => {
                    addToast({
                      title: "Success",
                      description: `Organization deleted!`,
                      color: "success",
                      variant: "flat",
                      icon: <GoTrash size={25} />,
                      timeout: 3000,
                    });
                    queryClient.refetchQueries({
                      queryKey: ["organizations"],
                    });
                  },
                  onError: () =>
                    alert({
                      icon: <GoTrash size={25} />,
                      status: "error",
                      subject: "Deletion Error!",
                      body: `Error occurred while attempting to delete item`,
                    }),
                },
              );
              break;
          }
        }}
        handleCancel={() => closeConfirm()}
        okText="YES"
        cancelText="NO"
      />

      <div className="flex items-center gap-2 px-3 mt-2 mb-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="-ml-1" />
          </TooltipTrigger>
          <TooltipContent side="bottom">Sidebar Trigger</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="ml-2 mr-3 my-2" />

        <Button
          variant="outline"
          size="icon-lg"
          //onClick={() => router.back()}
          disabled={isLoading}
        >
          <ArrowLeftIcon />
        </Button>

        <Button
          variant="secondary"
          size="icon-lg"
          //onClick={() => router.push("/portal/stores")}
          disabled={isLoading}
        >
          <HomeIcon />
        </Button>

        <div className="flex flex-col">
          <b className="text-lg">Organizations</b>
        </div>

        <div className="flex flex-1" />

        <Button variant="outline" onClick={() => setIsModalOpen?.(true)}>
          <PlusIcon />
          CREATE ORGANIZATION
        </Button>

        <Tooltip>
          <TooltipTrigger>
            <AnimatedThemeToggler className="ml-5 mt-1.5" />
          </TooltipTrigger>
          <TooltipContent side="bottom">Toggle Theme</TooltipContent>
        </Tooltip>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] justify-center gap-4 px-4">
        {data
          ? data.map(({ id, name, details, isActive }, index) => (
              <Card key={index.toString()} className="overflow-hidden py-0">
                <CardContent className="flex flex-col items-center p-0">
                  <div className="flex w-full flex-col items-center justify-center pt-5">
                    <div className="relative">
                      <div className="absolute bg-fuchsia-400/10" />
                      <SquareTerminalIcon
                        aria-hidden="true"
                        className="relative size-10 text-fuchsia-600"
                        strokeWidth="1.5"
                      />
                    </div>
                    <h3 className="text-foreground text-lg font-semibold">
                      {name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      No info about organization.
                    </p>
                  </div>
                  <div className="w-full space-y-1 px-4 pt-6">
                    {details.map(({ label, value }, index: number) => (
                      <div
                        key={index.toString()}
                        className={cn(
                          "rounded-md flex items-center justify-between px-3 py-2.5",
                          index % 2 === 0 && "bg-muted/40",
                        )}
                      >
                        <span className="text-foreground text-sm font-medium">
                          {label}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-end p-4">
                  <div>
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="switch-basic">Is Active?</FieldLabel>
                      <Switch
                        checked={isActive}
                        onCheckedChange={(value) => {
                          console.log(value);
                        }}
                      />
                    </Field>
                  </div>
                  <div className="flex flex-1" />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedOrganizationId(id);
                      confirm({
                        icon: <Trash2Icon />,
                        status: "error",
                        action: "delete",
                        subject: "Confirm deletion",
                        body: `Are you sure you intend to delete organization ${name}?`,
                      });
                    }}
                  >
                    DELETE
                  </Button>
                </CardFooter>
              </Card>
            ))
          : null}
      </div>
    </Fragment>
  );
}
