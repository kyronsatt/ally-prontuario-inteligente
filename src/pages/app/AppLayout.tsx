import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { PanelLeft } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/organisms/app-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/use-analytics";

const AppLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  // Track page views when route changes
  useEffect(() => {
    const pageName = location.pathname.split("/").pop() || "dashboard";
    trackPageView(pageName);
  }, [location.pathname, trackPageView]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset>
          <div className="relative p-0 md:py-4 md:px-2 h-svh shadow-none bg-gray-50">
            <div className="md:border py-8 md:py-0 border-gray-200 md:rounded-2xl bg-white h-full overflow-auto">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
