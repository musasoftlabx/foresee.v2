"use client";

import * as React from "react";

import { NavMain } from "@/components/admin/nav-main";
import { NavProjects } from "@/components/admin/nav-projects";
import { NavUser } from "@/components/admin/nav-user";
import { TeamSwitcher } from "@/components/admin/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/shadcn/sidebar";
import { GaugeIcon } from "../ui/lucide-animated/gauge";
import { TagIcon } from "../ui/heroicons-animated/tag";
import { NavDocuments } from "./nav-documents";
import { NavSecondary } from "./nav-secondary";
import {
  Building2Icon,
  LayoutDashboard,
  Shield,
  Store,
  StoreIcon,
  Users,
  Warehouse,
  WarehouseIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/shadcn/select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const data = {
  user: {
    name: "Foresee Technologies",
    email: "musasoftlabx@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
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
  ],
  navClouds: [
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
    {
      title: "Proposal",
      icon: GaugeIcon,
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
    {
      title: "Prompts",
      icon: GaugeIcon,
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
      icon: GaugeIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: GaugeIcon,
    },
    {
      title: "Configs",
      url: "/portal/configs",
      icon: GaugeIcon,
    },
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
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[
                    { label: "Select a fruit", value: null },
                    { label: "Foresee Inc.", value: "apple" },
                    { label: "Banana", value: "banana" },
                  ].map((item) => (
                    <SelectItem key={item.value} value={item.value as string}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select> */}

            {/* <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/portal/dashboard">
                <GaugeIcon className="size-5" />
                <span className="text-base font-semibold">Foresee Inc.</span>
              </a>
            </SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.audits} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
