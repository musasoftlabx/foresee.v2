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
import { UsersIcon } from "../ui/lucide-animated/users";
import { TagIcon } from "../ui/heroicons-animated/tag";
import { NavDocuments } from "./nav-documents";
import { NavSecondary } from "./nav-secondary";
import {
  Building2Icon,
  LayoutDashboard,
  Store,
  StoreIcon,
  Users,
  Warehouse,
  WarehouseIcon,
} from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/portal/dashboard",
      icon: LayoutDashboard,
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
      title: "User Management",
      url: "#",
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
      title: "Search",
      url: "#",
      icon: GaugeIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: GaugeIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: GaugeIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: GaugeIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/portal/dashboard">
                <GaugeIcon className="size-5" />
                <span className="text-base font-semibold">Foresee Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
