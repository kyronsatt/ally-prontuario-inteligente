
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppointmentProvider } from "@/context/AppointmentContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

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
              
              <Button
                variant="ghost"
                size="icon"
                aria-label="Configurações"
                onClick={() => console.log("Abrir configurações")}
              >
                <Settings className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Sair"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
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
