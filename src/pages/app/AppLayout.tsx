import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/organisms/app-sidebar";

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-100">
        <AppSidebar />
        <SidebarInset>
          <div className="p-4 h-svh shadow-none bg-gray-100">
            <div className="border border-gray-200 rounded-2xl bg-white p-8 h-full overflow-auto">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
