
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { AppointmentHistory } from "@/components/organisms/appointment-history";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AppointmentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const selectedAppointmentId = queryParams.get("id");

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
    <div className="max-w-4xl flex flex-col justify-self-center w-full">
      <Button
        variant="ghost"
        className="mb-6 w-fit"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao painel
      </Button>

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
        <AppointmentHistory
          appointments={appointments}
          showSearch={true}
        />
      )}
    </div>
  );
};

export default AppointmentHistoryPage;
