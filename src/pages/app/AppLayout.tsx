
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppointmentProvider } from "@/context/AppointmentContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

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

  return (
    <AppointmentProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="container-ally flex justify-between items-center">
            <button
              onClick={() => navigate("/app")}
              className="text-ally-dark font-semibold text-xl flex items-center"
            >
              <span className="gradient-text">Ally</span>
            </button>

            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-ally-gray mr-2">
                  {user.email}
                </span>
              )}
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Configurações"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="end">
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
