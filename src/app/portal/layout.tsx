import { AppSidebar } from "@/components/admin/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/shadcn/sidebar";

export default function Portal({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="p-2 w-0">{children}</SidebarInset>
    </SidebarProvider>
  );
}
