import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { useAppointment } from "@/context/AppointmentContext";
import { usePatient } from "@/context/PatientContext";
import { IAnamnese, useAnamnese } from "@/context/AnamneseContext";
import { useTranscription } from "@/context/TranscriptionContext";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import ActionButtons from "@/components/molecules/appointment-summary/action-buttons";
import PatientInfoCard from "@/components/organisms/appointment-summary/patient-info-card";
import AppointmentReport from "@/components/organisms/appointment-summary/report-content";
import ClinicalInsights from "@/components/organisms/clinical-insights";

const AppointmentSummary: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { appointment } = useAppointment();
  const {
    anamnese,
    isGeneratingAnamnese,
    generateAnamnese,
    retrieveAnamnese,
    isRetrievingAnamnese,
    updateAnamnese,
  } = useAnamnese();
  const { transcription } = useTranscription();
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [editedAnamnese, setEditedAnamnese] = useState<IAnamnese | undefined>(
    anamnese || undefined
  );
  const [isSaving, setIsSaving] = useState(false);
  const reportContentRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  useEffect(() => {
    if (anamnese === null && appointmentId) {
      retrieveAnamnese(appointmentId);
    } else if (anamnese === null && transcription) {
      // Handle the case where transcription might be a string or an object with raw_text
      const transcriptionText =
        typeof transcription === "string"
          ? transcription
          : transcription?.raw_text || "";

      generateAnamnese(transcriptionText);
    }
  }, [anamnese, appointmentId, transcription]);

  useEffect(() => {
    if (anamnese && !editedAnamnese) {
      setEditedAnamnese({ ...anamnese });
    }
  }, [anamnese, editedAnamnese]);

  const formattedDate = moment(appointment?.date).format("DD/MM/YY [às] HH:mm");

  const handleDownload = async () => {
    if (!reportContentRef.current) {
      toast.error("Não foi possível gerar o PDF");
      return;
    }

    toast("Gerando PDF...", {
      description: "Por favor, aguarde enquanto criamos seu documento.",
    });

    try {
      const element = reportContentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      // Document dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const doc = new jsPDF("p", "mm", "a4");
      let position = 15; // Start position from top

      // Add title
      doc.setFontSize(18);
      doc.setTextColor(44, 62, 80);
      doc.text("Anamnese Médica", 105, position, { align: "center" });
      position += 10;

      // Add patient info
      doc.setFontSize(12);
      doc.text(
        `Paciente: ${anamnese?.patient?.name || "Não identificado"}`,
        14,
        position
      );
      position += 6;
      doc.text(`Data: ${formattedDate}`, 14, position);
      position += 10;

      // Add the content image
      doc.addImage(imgData, "PNG", 10, position, imgWidth - 20, imgHeight);

      // Save the PDF
      doc.save(
        `anamnese_${anamnese?.patient?.name || "paciente"}_${moment().format(
          "DDMMYYYY"
        )}.pdf`
      );

      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erro ao gerar o PDF");
    }
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
      <div className="max-w-5xl mx-auto text-center py-16">
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
    <div ref={reportContentRef} className="w-full lg:max-w-5xl mx-auto pb-20">
      <div className="flex items-center mb-6">
        <Button
          onClick={() => navigate("/app")}
          variant="ghost"
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
      </div>

      <div className="flex justify-between items-center my-12">
        <h1 className="text-4xl md:text-6xl font-semibold mb-2 gradient-text">
          Anamnese
        </h1>
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <ActionButtons onDownload={handleDownload} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-7 h-fit">
        <PatientInfoCard
          patientName={
            appointment?.patient?.name ??
            anamnese?.patient?.name ??
            "Paciente não identificado"
          }
          appointmentDate={formattedDate}
          type={appointment?.type}
        />
        <ClinicalInsights insights={anamnese?.insights || []} />
      </div>
      <div className="mt-7">
        <AppointmentReport
          anamnese={editedAnamnese}
          unsavedChanges={unsavedChanges}
          isSaving={isSaving}
          saveChanges={handleSaveChanges}
          onUpdateSection={handleUpdateSection}
        />
      </div>
    </div>
  );
};

export default AppointmentSummary;
