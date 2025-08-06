import type React from 'react';
import { DashboardSidebar, DashboardFooter } from '@/widgets';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar';
import { DynamicBreadcrumb } from '@/shared/components/ui/dynamic-breadcrumb';
import { Separator } from '@/shared/components/ui/separator';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <main className="flex-1">{children}</main>
          <DashboardFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
