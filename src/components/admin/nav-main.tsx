"use client";

// * Next
import { useRouter } from "next/navigation";

// * SUI
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
import { Field } from "../ui/shadcn/field";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const router = useRouter();

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations-names"],
    queryFn: () => axios(`organizations?nameOnly=true`),
    select: ({ data }: { data: { name: string }[] }) => data,
  });

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-col items-center gap-2">
            <div className="group/avatar relative flex items-center justify-center">
              {/* Animated Story Ring */}
              <div className="absolute -inset-1 animate-[spin_3s_linear_infinite] rounded-full bg-linear-to-tr from-yellow-400 via-fuchsia-500 to-violet-600 opacity-75 blur-xs transition-all duration-500 group-hover/avatar:opacity-100 group-hover/avatar:blur-sm" />
              {/* Main Avatar */}
              {/* <Avatar className="ring-background size-10 ring-2 transition-transform duration-500 group-hover/avatar:scale-95 h-16 w-16">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="User Image"
                />
                <AvatarFallback className="text-white text-2xl bg-primary">
                  MM
                </AvatarFallback>
              </Avatar> */}
            </div>

            {/* <Avatar className="after:sidebar-primary dark:after:sidebar-primary h-16 w-16">
              <AvatarFallback className="text-white text-2xl bg-primary">
                MM
              </AvatarFallback>
            </Avatar> */}

            <div className="flex flex-col justify-center items-center gap-0.5">
              <span className="text-lg font-semibold">Musa Mutetwi</span>
              <span className="text-xs text-muted-foreground text-center">
                Signed in as role here
              </span>
            </div>

            <Field className="max-w-xs">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {organizations?.map((organization) => (
                      <SelectItem key={organization} value={organization}>
                        {organization}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </SidebarMenuItem>
        </SidebarMenu>

        <Separator className="my-3" />

        <SidebarMenu>
          {items.map((item) => (
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
  );
}
