
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/organisms/app-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset>
          <div className="py-2 md:py-4 px-1 md:px-2 h-svh shadow-none bg-gray-50">
            <div className="border border-gray-200 rounded-xl md:rounded-2xl bg-white py-4 md:py-8 px-4 md:px-8 lg:px-32 h-full overflow-auto">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
