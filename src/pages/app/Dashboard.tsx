import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Clock,
  Users,
  FileText,
  TrendingUp,
  ChartBar,
  Loader2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppointmentHistory } from "@/components/organisms/appointment-history";

interface AppointmentStats {
  total_appointments: number;
  new_patients: number;
  time_saved_minutes: number;
}

interface DashboardData {
  stats: AppointmentStats;
  recentAppointments: Array<any>;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke(
          "get-dashboard-data"
        );

        if (error) {
          throw new Error(`Error invoking function: ${error.message}`);
        }

        setData(data);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
        toast.error("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-ally-blue mb-4" />
        <p className="text-lg text-ally-gray">
          Carregando dados do dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-lg text-red-500 mb-4">
          Ocorreu um erro ao carregar os dados
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-ally-blue hover:bg-ally-blue/90"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  const timeSaved = data?.stats?.time_saved_minutes || 0;
  const appointments = data?.stats?.total_appointments || 0;
  const newPatients = data?.stats?.new_patients || 0;

  const avgTimeSavedPerAppointment =
    appointments > 0 ? Math.round(timeSaved / appointments) : 0;
  const productivityImprovement =
    avgTimeSavedPerAppointment > 0
      ? Math.min(Math.round((avgTimeSavedPerAppointment / 15) * 25), 50)
      : 0;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8 shadow-sm mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2 text-gray-900">
          Bem-vindo(a), <span className="text-ally-blue">Dr(a).</span>
        </h1>
        <p className="text-gray-600">
          Veja seu resumo de produtividade e estatísticas de consultas
        </p>
      </div>

      {/* Productivity Stats */}
      <div className="mb-8">
        <h2 className="text-2xl font-medium mb-4 text-gray-900">
          Ganhos de produtividade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="bg-white border-none shadow-md overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 border-b border-green-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-green-800">
                    Tempo economizado
                  </h3>
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-green-700">
                    {timeSaved}
                  </p>
                  <p className="text-lg text-green-600 mb-1">min</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Em média {avgTimeSavedPerAppointment} min por consulta
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-md overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-blue-800">Produtividade</h3>
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-blue-700">
                    +{productivityImprovement}%
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Aumento na eficiência do atendimento
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-md overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 border-b border-purple-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-purple-800">
                    Consultas realizadas
                  </h3>
                  <ChartBar className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-purple-700">
                    {appointments}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {newPatients} novos pacientes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Button
          onClick={() => navigate("/app/novo-atendimento")}
          size="lg"
          className="h-20 text-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all bg-ally-blue hover:bg-ally-blue/90"
        >
          <Plus className="h-6 w-6" />
          Novo Atendimento
        </Button>

        <Button
          onClick={() => navigate("/app/historico")}
          variant="outline"
          size="lg"
          className="h-20 text-lg flex items-center justify-center gap-3 border border-gray-200 shadow-md hover:shadow-lg transition-all"
        >
          <Clock className="h-6 w-6" />
          Histórico de Atendimentos
        </Button>
      </div>

      <Separator className="my-8" />

      {/* Recent Appointments */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium text-gray-900">
            Consultas recentes
          </h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/app/historico")}
            className="text-ally-blue hover:text-ally-blue/90"
          >
            Ver todas
          </Button>
        </div>

        <AppointmentHistory
          appointments={data?.recentAppointments || []}
          compact={true}
        />
      </div>
    </div>
  );
};

export default Dashboard;
