import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Clock,
  TrendingUp,
  ChartBar,
  Loader2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useStandardizedToast } from "@/hooks/use-standardized-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useAnalytics } from "@/hooks/use-analytics";

interface AppointmentStats {
  total_appointments: number;
  new_patients: number;
  time_saved_minutes: number;
}

interface DashboardData {
  stats: AppointmentStats;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trackPageView, trackButtonClick, trackEvent } = useAnalytics();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useStandardizedToast();

  useEffect(() => {
    trackPageView("dashboard");
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke(
          "get-dashboard-data",
          { body: { user_id: user.id } }
        );

        if (error) {
          throw new Error(`Error invoking function: ${error.message}`);
        }

        setData(data);
        trackEvent("dashboard_data_loaded", {
          total_appointments: data?.stats?.total_appointments || 0,
          new_patients: data?.stats?.new_patients || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error(
          "Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.",
          "Erro"
        );
        trackEvent("dashboard_data_error", { error: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

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

  // Get base metrics from data
  const totalAppointments = data?.stats?.total_appointments || 0;
  const newPatients = data?.stats?.new_patients || 0;
  const totalTimeSavedMinutes = data?.stats?.time_saved_minutes || 0;

  // Calculate productivity metrics based on the formula provided
  const timeWithAlly = 10; // minutes
  const timeReductionPercentage = 0.37; // 37% time reduction

  // Formula calculations
  const timeWithoutAlly = timeWithAlly / (1 - timeReductionPercentage); // ≈ 15.87 minutes
  const timeSavedPerAppointment = timeWithoutAlly - timeWithAlly; // ≈ 5.87 minutes
  const additionalAppointmentsPossible = Math.floor(
    totalTimeSavedMinutes / timeWithAlly
  );
  const productivityGainPercentage =
    totalAppointments > 0
      ? Math.round((additionalAppointmentsPossible / totalAppointments) * 100)
      : 0;

  // Format time saved for display
  const formatTimeSaved = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);

    if (hours === 0) {
      return `${remainingMinutes}min`;
    }

    return `${hours}h${remainingMinutes > 0 ? `${remainingMinutes}min` : ""}`;
  };

  const handleNewAppointmentClick = () => {
    trackButtonClick("new_appointment");
    navigate("/app/novo-atendimento");
  };

  const handleHistoryClick = () => {
    trackButtonClick("appointment_history");
    navigate("/app/historico");
  };

  return (
    <div className="max-w-5xl mx-auto w-full mt-12">
      {/* Welcome Banner */}
      <div className="text-ally-dark mb-20">
        <h1 className="text-4xl md:text-6xl font-semibold mb-2 gradient-text">
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
          onClick={handleNewAppointmentClick}
          size="lg"
          className="h-20 text-xl flex items-center justify-center gap-3 transition-all hover:opacity-90"
        >
          <Plus className="h-6 w-6" />
          Novo Atendimento
        </Button>

        <Button
          onClick={handleHistoryClick}
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
                    {formatTimeSaved(totalTimeSavedMinutes)}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Em média {timeSavedPerAppointment.toFixed(1)} min por consulta
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
                    +{productivityGainPercentage}%
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  +{additionalAppointmentsPossible} consultas possíveis
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
                    {totalAppointments}
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
