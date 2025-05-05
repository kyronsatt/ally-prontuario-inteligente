import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Clock, TrendingUp, ChartBar, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface AppointmentStats {
  total_appointments: number;
  new_patients: number;
  time_saved_minutes: number;
}

interface DashboardData {
  stats: AppointmentStats;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
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
    <div className="max-w-7xl mx-auto w-full mt-12">
      {/* Welcome Banner */}
      <div className="text-ally-dark mb-20">
        <h1 className="text-4xl md:text-7xl font-semibold mb-2 gradient-text">
          Dashboard
        </h1>
        <p className="text-ally-gray">
          Bem vindo(a), Dr(a). O que deseja fazer hoje?
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Button
          variant="default"
          onClick={() => navigate("/app/novo-atendimento")}
          size="lg"
          className="h-20 text-xl flex items-center justify-center gap-3 transition-all hover:opacity-90"
        >
          <Plus className="h-6 w-6" />
          Novo Atendimento
        </Button>

        <Button
          onClick={() => navigate("/app/historico")}
          variant="secondary"
          size="lg"
          className="h-20 text-xl flex items-center justify-center gap-3 transition-all"
        >
          <Clock className="h-6 w-6" />
          Histórico de Atendimentos
        </Button>
      </div>

      <Separator className="my-8" />

      {/* Productivity Stats */}
      <div className="mb-8">
        <h2 className="text-2xl font-medium mb-4 text-ally-dark">
          Análise de produtividade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="bg-white shadow-none overflow-hidden transition-all">
            <CardHeader>
              <CardTitle className="w-full flex items-center justify-between">
                <p className="text-lg">Tempo economizado</p>
                <Clock className="h-5 w-5 inline text-ally-blue" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-ally-dark/70">
                    {timeSaved}
                  </p>
                  <p className="text-lg text-ally-dark/70 mb-1">min</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Em média {avgTimeSavedPerAppointment} min por consulta
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-none overflow-hidden transition-all">
            <CardHeader>
              <CardTitle className="w-full flex items-center justify-between">
                <p className="text-lg">Produtividade</p>
                <TrendingUp className="h-5 w-5 inline text-ally-blue" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-ally-dark/70">
                    +{productivityImprovement}%
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Aumento na eficiência do atendimento
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-none overflow-hidden transition-all">
            <CardHeader>
              <CardTitle className="w-full flex items-center justify-between">
                <p className="text-lg">Consultas realizadas</p>
                <ChartBar className="h-5 w-5 inline text-ally-blue" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-ally-dark/70">
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
    </div>
  );
};

export default Dashboard;
