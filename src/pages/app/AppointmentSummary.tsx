import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Pencil, Save } from "lucide-react";

import { useAppointment } from "@/context/AppointmentContext";
import { usePatient } from "@/context/PatientContext";

import { Button } from "@/components/ui/button";
import ActionButtons from "@/components/molecules/appointment-summary/action-buttons";
import PatientInfoCard from "@/components/organisms/appointment-summary/patient-info-card";
import AppointmentReport from "@/components/organisms/appointment-summary/report-content";
import { supabase } from "@/integrations/supabase/client";
import { Anamnese } from "@/context/AppointmentContext";

const AppointmentSummary: React.FC = () => {
  const navigate = useNavigate();
  const { appointment, setAppointment, isProcessing } = useAppointment();
  const { patient } = usePatient();

  const [isEditing, setIsEditing] = useState(false);
  const [editedAnamnese, setEditedAnamnese] = useState<Anamnese | undefined>(
    appointment.anamnese
  );
  const [isSaving, setIsSaving] = useState(false);

  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointment_id");

  useEffect(() => {
    if (!appointment.anamnese) {
      if (!appointmentId) {
        toast.error("ID de atendimento não encontrado.");
        navigate("/app/novo-atendimento");
        return;
      }

      // TODO -> Fetch the appointment data from Supabase
    }
  }, [appointment, isProcessing, navigate, appointmentId]);

  useEffect(() => {
    if (appointment.anamnese && !editedAnamnese) {
      setEditedAnamnese({ ...appointment.anamnese });
    }
  }, [appointment.anamnese, editedAnamnese]);

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

  const handleUpdateSection = (section: string, content: string) => {
    if (editedAnamnese) {
      setEditedAnamnese({
        ...editedAnamnese,
        [section]: content,
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!editedAnamnese || !appointment.id) return;

    setIsSaving(true);

    try {
      // Update the anamnese in the database
      const { error } = await supabase
        .from("anamnese")
        .update({
          ...editedAnamnese,
          created_at: editedAnamnese.created_at.toString(),
        })
        .eq("appointment_id", appointment.id);

      if (error) throw error;

      // Update the local state
      setAppointment((prev) => ({
        ...prev,
        anamnese: editedAnamnese,
      }));

      setIsEditing(false);
      toast.success("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast.error("Erro ao salvar alterações");
    } finally {
      setIsSaving(false);
    }
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
          Anamnese Estruturada
        </h1>
        <div className="flex gap-3">
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

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-14">
        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar alterações
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditedAnamnese(appointment.anamnese);
                  setIsEditing(false);
                }}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar anamnese
            </Button>
          )}
        </div>
        <ActionButtons onPrint={handlePrint} onDownload={handleDownload} />
      </div>

      <AppointmentReport
        anamnese={isEditing ? editedAnamnese : appointment.anamnese}
        isEditable={isEditing}
        onUpdateSection={handleUpdateSection}
      />
    </div>
  );
};

export default AppointmentSummary;
