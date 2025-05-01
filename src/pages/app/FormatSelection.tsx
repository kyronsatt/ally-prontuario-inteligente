import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { useAppointment } from "@/context/AppointmentContext";

import { Button } from "@/components/ui/button";
import FormatList from "@/components/organisms/format-list";

const FormatSelection: React.FC = () => {
  const navigate = useNavigate();
  const { appointment, setAppointment, isProcessing } = useAppointment();

  useEffect(() => {
    if (!appointment.transcription && !isProcessing) {
      navigate("/app/escuta");
    }
  }, [appointment.transcription, isProcessing, navigate]);

  const handleFormatSelect = (format: string) => {
    setAppointment((prev) => ({
      ...prev,
      selectedFormat: format,
    }));
    navigate("/app/resumo?format=" + format);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/app")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao painel
      </Button>

      <div className="bg-white border-none shadow-sm mb-8 p-8 text-center rounded-md">
        <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          Atendimento processado com sucesso!
        </h1>
        <p className="text-gray-600 mb-6">
          Como deseja visualizar o resultado?
        </p>
      </div>

      <FormatList onFormatSelect={handleFormatSelect} />
    </div>
  );
};

export default FormatSelection;
