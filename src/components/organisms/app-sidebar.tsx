import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  PlusCircle,
  Clock,
  HelpCircle,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AllyLogo } from "../atoms/ally-logo";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/app",
    },
    {
      title: "Novo Atendimento",
      icon: PlusCircle,
      path: "/app/novo-atendimento",
    },
    {
      title: "Histórico",
      icon: Clock,
      path: "/app/historico",
    },
  ];

  const userMenuItems = [
    {
      title: "Ajuda",
      icon: HelpCircle,
      path: "/app/ajuda",
    },
    {
      title: "Configurações",
      icon: Settings,
      path: "/app/configuracoes",
    },
    {
      title: "Perfil",
      icon: UserCircle,
      path: "/app/perfil",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";

    if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
      return `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase();
    } else if (user.email) {
      return user.email[0].toUpperCase();
    }

    return "U";
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <div className="flex justify-center items-center pt-12 pb-8">
          <AllyLogo className="h-14" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Usuário</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-ally-blue text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">
                {user?.user_metadata?.first_name
                  ? `Dr. ${user.user_metadata.first_name} ${
                      user.user_metadata.last_name || ""
                    }`
                  : user?.email || "Usuário"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-2 text-sm text-red-500 hover:text-red-600 p-2 rounded-md hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
