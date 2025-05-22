import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus,
  Clock,
  Settings,
  User,
  CreditCard,
  HelpCircle,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AllyLogo } from "@/components/atoms/ally-logo";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnalytics } from "@/hooks/use-analytics";
import SidebarMenuItemComponent from "@/components/molecules/sidebar/menu-item";

export function AppSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { openMobile, setOpenMobile } = useSidebar();
  const toast = useToast();
  const { trackEvent, trackUserEvent } = useAnalytics();

  const handleSignOut = async () => {
    try {
      await signOut();
      trackUserEvent("logout");
      toast.success(
        "Você foi desconectado do sistema.",
        "Sessão encerrada com sucesso"
      );
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      trackEvent("error_occurred", {
        error_type: "logout_error",
        error_message: "Failed to sign out",
      });
      toast.error(
        "Não foi possível encerrar sua sessão. Tente novamente.",
        "Erro ao sair"
      );
    }
  };

  // Track page views
  useEffect(() => {
    if (location.pathname) {
      const pageName = location.pathname.split("/").pop() || "home";
      trackEvent("page_view", {
        page_name: pageName,
        full_path: location.pathname,
      });
    }
  }, [location.pathname, trackEvent]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile && openMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, openMobile, setOpenMobile]);

  const logoClassName = isMobile ? "scale-75" : "";
  const iconSize = isMobile ? 18 : 24;

  return (
    <Sidebar variant="floating">
      <SidebarHeader className="relative border-b border-border py-2 md:py-4 px-1 md:px-2 flex items-center justify-between">
        <div
          className={`flex items-center gap-2 px-2 md:px-4 pb-4 md:pb-6 pt-6 md:pt-10 ${logoClassName}`}
        >
          <AllyLogo />
        </div>
        <SidebarTrigger className="fixed top-0 left-0 m-2 md:m-5" />
      </SidebarHeader>

      <SidebarContent className="p-2 flex flex-col gap-2">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItemComponent
              to="/app"
              icon={LayoutDashboard}
              label="Dashboard"
              iconSize={iconSize}
              end
            />
            <SidebarMenuItemComponent
              to="/app/novo-atendimento"
              icon={FilePlus}
              label="Novo Atendimento"
              iconSize={iconSize}
            />
            <SidebarMenuItemComponent
              to="/app/historico"
              icon={Clock}
              label="Histórico"
              iconSize={iconSize}
            />
          </SidebarMenu>
        </SidebarGroupContent>

        <div className="border-t border-border my-1"></div>

        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItemComponent
              to="/app/subscription"
              icon={CreditCard}
              label="Assinatura"
              iconSize={iconSize}
            />
            <SidebarMenuItemComponent
              to="/app/perfil"
              icon={User}
              label="Perfil"
              iconSize={iconSize}
            />
            <SidebarMenuItemComponent
              to="/app/configuracoes"
              icon={Settings}
              label="Configurações"
              iconSize={iconSize}
            />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItemComponent
            to="/app/ajuda"
            icon={HelpCircle}
            label="Ajuda"
            iconSize={iconSize}
          />
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut size={iconSize} />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
