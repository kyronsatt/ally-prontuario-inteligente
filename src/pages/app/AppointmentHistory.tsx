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
  const [searchTerm, setSearchTerm] = useState("");
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
            body: { search: searchTerm },
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
  }, [searchTerm]);

  return (
    <div className="max-w-4xl flex flex-col justify-self-center w-full">
      <Button
        variant="ghost"
        className="mb-6 w-fit"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao painel
      </Button>

      <AppointmentHistory
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        appointments={appointments}
        loading={loading}
        error={error}
        selectedAppointmentId={selectedAppointmentId}
        onRetry={() => window.location.reload()}
        onViewDetails={(id) => navigate(`/app/historico?id=${id}`)}
      />
    </div>
  );
};

export default AppointmentHistoryPage;
