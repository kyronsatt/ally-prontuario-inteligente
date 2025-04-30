
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Settings, LogOut, User, Home, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppointmentProvider } from "@/context/AppointmentContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
}

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        setProfile(data);
      } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    if (profile?.first_name) {
      return `Dr(a). ${profile.first_name} ${profile.last_name || ''}`;
    }
    return user?.email || 'Usuário';
  };

  return (
    <AppointmentProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="container-ally py-3">
            <div className="flex justify-between items-center">
              {/* Logo and navigation */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => navigate("/app")}
                  className="text-ally-dark font-semibold text-xl flex items-center"
                >
                  <span className="gradient-text">Ally</span>
                </button>
                
                <nav className="hidden md:flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/app")}
                    className="text-gray-600 hover:text-ally-blue"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    Dashboard
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/app/novo-atendimento")}
                    className="text-gray-600 hover:text-ally-blue"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Novo Atendimento
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/app/historico")}
                    className="text-gray-600 hover:text-ally-blue"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Histórico
                  </Button>
                </nav>
              </div>

              {/* User account */}
              <div className="flex items-center gap-4">
                <span className="hidden md:block text-sm text-ally-gray">
                  {getDisplayName()}
                </span>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-9 w-9 p-0 border border-gray-200"
                      aria-label="Menu de usuário"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-ally-blue text-white">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0" align="end">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-sm font-medium">{getDisplayName()}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => navigate('/app/configuracoes')}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configurações
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 py-8 px-6">
          <div className="container-ally">
            <Outlet />
          </div>
        </main>
      </div>
    </AppointmentProvider>
  );
};

export default AppLayout;
