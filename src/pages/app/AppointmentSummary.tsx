import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

import { useAppointment } from "@/context/AppointmentContext";
import { usePatient } from "@/context/PatientContext";

import { Button } from "@/components/ui/button";
import ActionButtons from "@/components/molecules/appointment-summary/action-buttons";
import FormatSelector from "@/components/molecules/appointment-summary/format-selector";
import PatientInfoCard from "@/components/organisms/appointment-summary/patient-info-card";
import AppointmentReport from "@/components/organisms/appointment-summary/report-content";

const AppointmentSummary: React.FC = () => {
  const navigate = useNavigate();
  const { appointment, isProcessing } = useAppointment();
  const { patient } = usePatient();
  const [searchParams] = useSearchParams();
  const [viewFormat, setViewFormat] = useState<string>("soap");

  useEffect(() => {
    const formatParam = searchParams.get("format");
    if (formatParam) {
      setViewFormat(formatParam);
    } else if (appointment.selectedFormat) {
      setViewFormat(appointment.selectedFormat);
    }
  }, [searchParams, appointment.selectedFormat]);

  useEffect(() => {
    if (!isProcessing && (!appointment.soapNote || !appointment.anamneseNote)) {
      navigate("/app/novo-atendimento");
    }
  }, [appointment, isProcessing, navigate]);

  const formattedDate = appointment.date
    ? format(appointment.date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR,
      })
    : "";

  const handlePrint = () => {
    window.print();
    toast("Imprimindo relatório", {
      description: "Enviando para impressão...",
    });
  };

  const handleDownload = () => {
    toast("Download iniciado", {
      description: "Seu relatório está sendo preparado para download.",
    });
  };

  const handleShare = () => {
    toast("Compartilhar relatório", {
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  if (isProcessing) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-blue-50 p-4">
            <Loader2 className="h-12 w-12 text-ally-blue animate-spin" />
          </div>
          <h2 className="text-2xl font-bold">
            Finalizando relatório médico...
          </h2>
          <p className="text-gray-600">
            Quase pronto! Estamos finalizando o relatório da sua consulta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          onClick={() => navigate("/app")}
          variant="ghost"
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Resumo do Atendimento
        </h1>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/app/historico")} variant="outline">
            Ver histórico
          </Button>
          <Button
            onClick={() => navigate("/app/novo-atendimento")}
            className="bg-ally-blue hover:bg-ally-blue/90"
          >
            Novo atendimento
          </Button>
        </div>
      </div>

      <PatientInfoCard
        patientName={
          appointment.patient?.name ??
          patient?.name ??
          "Paciente não identificado"
        }
        appointmentDate={formattedDate}
      />

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <FormatSelector
          viewFormat={viewFormat}
          onSelectFormat={setViewFormat}
        />
        <ActionButtons
          onPrint={handlePrint}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      </div>

      <AppointmentReport
        viewFormat={viewFormat}
        soapNote={appointment.soapNote}
        anamneseNote={appointment.anamneseNote}
      />
    </div>
  );
};

export default AppointmentSummary;
