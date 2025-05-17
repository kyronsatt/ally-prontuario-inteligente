import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import { AllyLogo } from "@/components/atoms/ally-logo";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-standardized-toast";

export function AppSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(
        "Você foi desconectado do sistema.",
        "Sessão encerrada com sucesso"
      );
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error(
        "Não foi possível encerrar sua sessão. Tente novamente.",
        "Erro ao sair"
      );
    }
  };

  return (
    <Sidebar variant="floating">
      <SidebarHeader className=" relative border-b border-border py-4 px-2 flex items-center justify-between">
        <div className="flex items-center gap-2 px-4 pb-6 pt-10">
          <AllyLogo />
        </div>
        <SidebarTrigger className="fixed top-0 left-0 m-5" />
      </SidebarHeader>

      <SidebarContent className="p-2 flex flex-col gap-2">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/app"
                  className={({ isActive }) =>
                    isActive ? "text-ally-blue" : "text-muted-foreground"
                  }
                  end
                >
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/app/novo-atendimento"
                  className={({ isActive }) =>
                    isActive ? "text-ally-blue" : "text-muted-foreground"
                  }
                >
                  <FilePlus />
                  <span>Novo Atendimento</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/app/historico"
                  className={({ isActive }) =>
                    isActive ? "text-ally-blue" : "text-muted-foreground"
                  }
                >
                  <Clock />
                  <span>Histórico</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>

        <div className="border-t border-border my-1"></div>

        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/app/subscription"
                  className={({ isActive }) =>
                    isActive ? "text-ally-blue" : "text-muted-foreground"
                  }
                >
                  <CreditCard />
                  <span>Assinatura</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/app/perfil"
                  className={({ isActive }) =>
                    isActive ? "text-ally-blue" : "text-muted-foreground"
                  }
                >
                  <User />
                  <span>Perfil</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/app/configuracoes"
                  className={({ isActive }) =>
                    isActive ? "text-ally-blue" : "text-muted-foreground"
                  }
                >
                  <Settings />
                  <span>Configurações</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/app/ajuda"
                  className={({ isActive }) =>
                    isActive ? "text-ally-blue" : "text-muted-foreground"
                  }
                >
                  <HelpCircle />
                  <span>Ajuda</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
