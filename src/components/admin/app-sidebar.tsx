"use client";

import { useState } from "react";

import Image from "next/image";

import axios from "axios";

import { GaugeIcon } from "../ui/lucide-animated/gauge";
import { NavSecondary } from "./nav-secondary";
import {
  Building2Icon,
  LayoutDashboard,
  PanelsLeftBottom,
  SettingsIcon,
  Shield,
  Store,
  Users,
  Warehouse,
} from "lucide-react";

// * Hooks
import useJWT from "@/hooks/useJWT";
// * Next
import { useRouter } from "next/navigation";

// * SUI
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/shadcn/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import { Separator } from "@/components/ui/shadcn/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/shadcn/select";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";

import { Field } from "../ui/shadcn/field";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const data = {
  user: {
    name: "Foresee Technologies",
    email: "musasoftlabx@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  main: [
    {
      title: "Dashboard",
      url: "/portal/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Organizations",
      url: "/portal/organizations",
      icon: Building2Icon,
    },
    {
      title: "Clients",
      url: "/portal/clients",
      icon: Warehouse,
    },
    {
      title: "Stores",
      url: "/portal/stores",
      icon: Store,
    },
    {
      title: "Members",
      url: "/portal/members",
      icon: Users,
    },
    {
      title: "Sidebar Management",
      url: "/portal/sidebar",
      icon: PanelsLeftBottom,
    },
  ],
  admin: [
    {
      title: "Capture",
      icon: GaugeIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    // {
    //   title: "Configs",
    //   url: "/portal/configs",
    //   icon: MonitorConfigIcon,
    // },
  ],
  audits: [
    {
      title: "Previous Audits",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Sign In 1",
          url: "/sign-in",
        },
        {
          title: "Sign In 2",
          url: "/sign-in-2",
        },
        {
          title: "Sign In 3",
          url: "/sign-in-3",
        },
        {
          title: "Sign Up 1",
          url: "/sign-up",
        },
        {
          title: "Sign Up 2",
          url: "/sign-up-2",
        },
        {
          title: "Sign Up 3",
          url: "/sign-up-3",
        },
        {
          title: "Forgot Password 1",
          url: "/forgot-password",
        },
        {
          title: "Forgot Password 2",
          url: "/forgot-password-2",
        },
        {
          title: "Forgot Password 3",
          url: "/forgot-password-3",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useJWT();

  const router = useRouter();
  const queryClient = useQueryClient();
  const { isMobile } = useSidebar();

  const [currentOrganization, setCurrentOrganization] = useState<string>("");

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations-names"],
    queryFn: () =>
      axios(`organizations?nameOnly=true`).then((res) => {
        setCurrentOrganization(
          res.data.find(
            (org: { isActive: boolean; name: string }) =>
              org.isActive && org.name,
          ).name,
        );
        return res;
      }),
    select: ({
      data,
    }: {
      data: { id: number; name: string; isActive: boolean }[];
    }) => data,
  });

  const { mutate: updateOrganization } = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      axios.patch("organizations", { id }),
  });

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem className="flex flex-col items-center gap-2">
                <div className="group/avatar relative flex items-center justify-center">
                  {/* Animated Story Ring */}
                  {/* <div className="absolute -inset-1 animate-[spin_3s_linear_infinite] rounded-full bg-linear-to-tr from-yellow-400 via-fuchsia-500 to-violet-600 opacity-75 blur-xs transition-all duration-500 group-hover/avatar:opacity-100 group-hover/avatar:blur-sm" />*/}
                  {/* Main Avatar */}
                  {/* <Avatar className="ring-background size-10 ring-2 transition-transform duration-500 group-hover/avatar:scale-95 h-16 w-16">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="User Image"
                        />
                        <AvatarFallback className="text-white text-2xl bg-primary">
                          MM
                        </AvatarFallback>
                      </Avatar>
                  */}
                  <Avatar className="after:sidebar-primary dark:after:sidebar-primary h-16 w-16">
                    <AvatarFallback className="text-white text-2xl bg-primary">
                      {profile?.firstName?.split("")[0]}
                      {profile?.lastName?.split("")[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex flex-col justify-center items-center gap-0.5">
                  <span className="text-lg font-semibold">
                    {profile?.firstName} {profile?.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground text-center">
                    Signed in as {profile?.roles[0]}
                  </span>
                </div>

                <Field className="max-w-xs">
                  <Select
                    value={currentOrganization}
                    onValueChange={(value) => {
                      setCurrentOrganization(value);
                      updateOrganization(
                        {
                          id:
                            organizations?.find((org) => org.name === value)
                              ?.id ?? 0,
                        },
                        //{ onSuccess: () => router.refresh() },
                        { onSuccess: () => location.reload() },
                      );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {organizations?.map(({ id, name }) => (
                          <SelectItem key={id} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    {/* <Spinner className="size-6" /> */}
                  </Select>
                </Field>
              </SidebarMenuItem>
            </SidebarMenu>

            <Separator className="my-3" />

            <SidebarMenu>
              {data.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => router.push(item.url)}
                  >
                    {item.icon && <item.icon size={20} />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <NavDocuments items={data.audits} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/logo.png" alt={data.user.name} />
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={50}
                      height={50}
                      className="invert mb-2"
                    />
                    <AvatarFallback className="rounded-lg">FT</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={data.user.avatar}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg">MM</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {data.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.replace("/")}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
