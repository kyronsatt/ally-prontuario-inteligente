import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import { ArrowLeft, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { useAppointment } from "@/context/AppointmentContext";
import { usePatient } from "@/context/PatientContext";
import { useAnamnese } from "@/context/AnamneseContext";
import { IAnamnese } from "@/types/anamnese";
import { useTranscription } from "@/context/TranscriptionContext";
import { useIsMobile } from "@/hooks/use-mobile";

import PatientInfoCard from "@/components/organisms/appointment-summary/patient-info-card";
import AppointmentReport from "@/components/organisms/appointment-summary/report-content";
import ClinicalInsights from "@/components/organisms/clinical-insights";
import { AppHeader } from "@/components/molecules/app-header";
import { toast } from "@/hooks/use-standardized-toast";

const AppointmentSummary: React.FC = () => {
  const { appointment } = useAppointment();
  const {
    anamnese,
    generateAnamnese,
    retrieveAnamnese,
    isRetrievingAnamnese,
    updateAnamnese,
  } = useAnamnese();
  const { transcription } = useTranscription();
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [editedAnamnese, setEditedAnamnese] = useState<IAnamnese | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const reportContentRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  useEffect(() => {
    if (anamnese === null && appointmentId) {
      retrieveAnamnese(appointmentId);
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

    toast.info(
      "Por favor, aguarde enquanto criamos seu documento.",
      "Gerando PDF..."
    );

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

  if (isRetrievingAnamnese) {
    return (
      <div className="max-w-5xl mx-auto text-center py-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-blue-50 p-4">
            <Loader2 className="h-12 w-12 text-ally-blue animate-spin" />
          </div>
          <h2 className="text-2xl font-bold">Acessando anamnese...</h2>
          <p className="text-gray-600">
            Aguarde um instante! Estamos obtendo a anamnese.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={reportContentRef} className="app-template pb-20">
      <AppHeader title="Anamnese" />
      {/* <div className="flex flex-col sm:flex-row justify-end gap-4 my-8">
        <ActionButtons onDownload={handleDownload} />
      </div> */}

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
