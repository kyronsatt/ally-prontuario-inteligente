import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { AppointmentHistory } from "@/components/organisms/appointment-history";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AppointmentHistoryPage: React.FC = () => {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke(
          "get-appointments",
          {
            body: {},
          }
        );

        if (error) throw new Error(`Error invoking function: ${error.message}`);

        setAppointments(data.appointments || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err.message);
        toast.error("Erro ao carregar histórico de atendimentos");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleRetry = () => window.location.reload();

  return (
    <div className="max-w-5xl lg:mt-12 flex flex-col justify-self-center w-full">
      <div className="text-ally-dark mb-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="w-fit"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />{" "}
            <span className="hidden sm:block">Voltar ao painel</span>
          </Button>

          <SidebarTrigger className="z-[999] sm:hidden" />
        </div>
        <h1 className="text-4xl md:text-6xl mt-6 font-semibold mb-2 gradient-text">
          Histórico
        </h1>
      </div>

      {loading ? (
        <div className="text-center p-6">Carregando...</div>
      ) : error ? (
        <div className="text-center p-6 text-red-500">
          <p>Erro ao carregar histórico: {error}</p>
          <Button onClick={handleRetry} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      ) : (
        <AppointmentHistory appointments={appointments} showSearch={true} />
      )}
    </div>
  );
};

export default AppointmentHistoryPage;
