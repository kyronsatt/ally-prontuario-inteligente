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
          <div className="relative py-2 md:py-4 px-1 md:px-2 h-svh shadow-none bg-gray-50">
            <div className="border border-gray-200 rounded-xl md:rounded-2xl bg-white pb-4 pt-10 md:py-8 px-4 md:px-8 lg:px-32 h-full overflow-auto">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
