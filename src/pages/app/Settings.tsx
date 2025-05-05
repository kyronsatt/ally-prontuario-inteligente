import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { User, Settings as SettingsIcon, LogOut, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  birth_date: string | null;
  city: string | null;
  state: string | null;
  specialty: string | null;
  crm: string | null;
}

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
        toast.error("Erro ao carregar dados do perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast.success("Logout realizado com sucesso");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não informado";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("pt-BR").format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Configurações</h1>

      <div className="grid gap-8">
        {/* Perfil do usuário */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 mb-8">
            <CardTitle className="text-xl font-medium">
              Perfil de usuário
            </CardTitle>
            <User className="h-5 w-5 text-ally-gray" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-ally-blue" />
              </div>
            ) : profile ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500">
                        Nome completo
                      </p>
                      <p className="text-lg">
                        {profile.first_name} {profile.last_name}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-lg">{user?.email}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500">
                        Data de Nascimento
                      </p>
                      <p className="text-lg">
                        {formatDate(profile.birth_date)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500">
                        Cidade/Estado
                      </p>
                      <p className="text-lg">
                        {profile.city}
                        {profile.city && profile.state ? ", " : ""}
                        {profile.state}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500">
                        Especialidade
                      </p>
                      <p className="text-lg">
                        {profile.specialty || "Não informada"}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500">CRM</p>
                      <p className="text-lg">
                        {profile.crm || "Não informado"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      user?.email_confirmed_at ? "bg-green-500" : "bg-amber-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {user?.email_confirmed_at
                      ? "Email verificado"
                      : "Email não verificado"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                Perfil não encontrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Opção de logout */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 mb-8">
            <CardTitle className="text-xl font-medium">Sessão</CardTitle>
            <LogOut className="h-5 w-5 text-ally-gray" />
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Ao sair, você precisará fazer login novamente para acessar o
              aplicativo.
            </p>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Saindo..." : "Sair da conta"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
