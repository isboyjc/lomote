'use client'

import React from 'react';
import { AppSidebar } from '@/components/admin/app-sidebar';
import { AppHeader } from '@/components/admin/app-header';
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
