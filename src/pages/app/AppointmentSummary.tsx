import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Pencil, Save } from "lucide-react";

import { useAppointment } from "@/context/AppointmentContext";
import { usePatient } from "@/context/PatientContext";
import { IAnamnese, useAnamnese } from "@/context/AnamneseContext";
import { useTranscription } from "@/context/TranscriptionContext";

import { Button } from "@/components/ui/button";
import ActionButtons from "@/components/molecules/appointment-summary/action-buttons";
import PatientInfoCard from "@/components/organisms/appointment-summary/patient-info-card";
import AppointmentReport from "@/components/organisms/appointment-summary/report-content";

const AppointmentSummary: React.FC = () => {
  const navigate = useNavigate();
  const { appointment, setAppointment } = useAppointment();
  const {
    anamnese,
    isGeneratingAnamnese,
    generateAnamnese,
    retrieveAnamnese,
    isRetrievingAnamnese,
    updateAnamnese,
  } = useAnamnese();
  const { transcription } = useTranscription();
  const { patient } = usePatient();
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [editedAnamnese, setEditedAnamnese] = useState<IAnamnese | undefined>(
    anamnese
  );
  const [isSaving, setIsSaving] = useState(false);

  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  useEffect(() => {
    if (!anamnese && appointmentId) {
      retrieveAnamnese(appointmentId);
    } else if (!anamnese && transcription) {
      generateAnamnese(transcription.raw_text);
    }
  }, [anamnese, appointmentId, transcription]);

  useEffect(() => {
    if (anamnese && !editedAnamnese) {
      setEditedAnamnese({ ...anamnese });
    }
  }, [anamnese, editedAnamnese]);

  const formattedDate = moment(appointment?.date).format("DD/MM/YY [às] HH:mm");

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

  const handleUpdateSection = (section: string, content: string) => {
    setUnsavedChanges(true);
    setEditedAnamnese((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: content,
      };
    });
  };

  const handleSaveChanges = async () => {
    if (!editedAnamnese || !editedAnamnese.id) return;

    setIsSaving(true);
    try {
      const { success } = await updateAnamnese(editedAnamnese.id, {
        current_illness_history: editedAnamnese.current_illness_history,
        identification: editedAnamnese.identification,
        complementary_exams: editedAnamnese.complementary_exams,
        diagnostic_hypotheses: editedAnamnese.diagnostic_hypotheses,
        family_history: editedAnamnese.family_history,
        main_complaint: editedAnamnese.main_complaint,
        past_medical_history: editedAnamnese.past_medical_history,
        physical_exams: editedAnamnese.physical_exams,
        social_history: editedAnamnese.social_history,
        therapeutic_approach: editedAnamnese.therapeutic_approach,
      });

      if (!success) {
        throw new Error("Erro ao atualizar anamnese");
      }

      setUnsavedChanges(false);
      toast.success("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast.error("Erro ao salvar alterações");
    } finally {
      setIsSaving(false);
    }
  };

  if (isGeneratingAnamnese || isRetrievingAnamnese) {
    const action = isGeneratingAnamnese ? "Finalizando" : "Acessando";
    return (
      <div className="max-w-7xl mx-auto text-center py-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-blue-50 p-4">
            <Loader2 className="h-12 w-12 text-ally-blue animate-spin" />
          </div>
          <h2 className="text-2xl font-bold">{action} anamnese...</h2>
          <p className="text-gray-600">
            {isGeneratingAnamnese
              ? "Quase pronto! Estamos finalizando a anamnese da sua consulta."
              : "Aguarde um instante! Estamos obtendo a anamnese."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex items-center mb-6">
        <Button
          onClick={() => navigate("/app")}
          variant="ghost"
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6 mt-12">
        <h1 className="text-4xl md:text-7xl font-semibold mb-2 gradient-text">
          Anamnese Estruturada
        </h1>
      </div>

      <PatientInfoCard
        patientName={
          appointment?.patient?.name ??
          anamnese.patient?.name ??
          "Paciente não identificado"
        }
        appointmentDate={formattedDate}
      />

      <div className="flex flex-col sm:flex-row justify-end gap-4 mb-14">
        <ActionButtons onPrint={handlePrint} onDownload={handleDownload} />
      </div>

      <AppointmentReport
        anamnese={editedAnamnese}
        unsavedChanges={unsavedChanges}
        isSaving={isSaving}
        saveChanges={handleSaveChanges}
        onUpdateSection={handleUpdateSection}
      />
    </div>
  );
};

export default AppointmentSummary;
