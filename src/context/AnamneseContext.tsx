import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { envs } from "@/envs";

import { useAppointment } from "./AppointmentContext";
import { useAuth } from "./AuthContext";
import { useTranscription } from "./TranscriptionContext";
import { PatientData, usePatient } from "./PatientContext";
import { useToast } from "@/hooks/use-toast";

export interface InsightItem {
  type: "risk" | "finding" | "suggestion" | "red_flag";
  label: string;
  content: string;
}

interface AnamneseContextType {
  anamnese: IAnamnese | null;
  previousAnamnese: IAnamnese | null;
  isGeneratingAnamnese: boolean;
  isRetrievingAnamnese: boolean;
  generateAnamnese: (transcription: string) => Promise<void>;
  retrieveAnamnese: (appointmentId: string) => Promise<void>;
  retrieveLastAnamnese: (patientId: string) => Promise<void>;
  updateAnamnese: (
    anamneseId: string,
    updatedData: IAnamneseMedicalPayload
  ) => Promise<{ success: boolean }>;
  setAppointmentNotes: React.Dispatch<React.SetStateAction<string>>;
  appointmentNotes?: string;
}

export interface IAnamneseMedicalPayload {
  identification: string;
  main_complaint: string;
  current_illness_history: string;
  past_medical_history: string;
  social_history: string;
  family_history: string;
  physical_exams: string;
  complementary_exams: string;
  therapeutic_approach: string;
  diagnostic_hypotheses: string;
}

export interface IAnamnese extends IAnamneseMedicalPayload {
  id: string;
  appointment_id: string;
  transcription_id: string;
  patient_id: string;
  patient: PatientData;
  created_by: string;
  created_at: Date;
  insights: InsightItem[];
}

const AnamneseContext = createContext<AnamneseContextType | undefined>(
  undefined
);

export const AnamneseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const { appointment } = useAppointment();
  const { transcription } = useTranscription();
  const { patient } = usePatient();
  const [appointmentNotes, setAppointmentNotes] = useState<
    string | undefined
  >();

  const [isGeneratingAnamnese, setIsGeneratingAnamnese] = useState(false);
  const [isRetrievingAnamnese, setIsRetrievingAnamnese] = useState(false);
  const [anamnese, setAnamnese] = useState<IAnamnese | null>(null);
  const [previousAnamnese, setPreviousAnamnese] = useState<IAnamnese | null>(
    null
  );

  const generateAnamnese = async (transcriptionText: string) => {
    setIsGeneratingAnamnese(true);
    console.log("[generateAnamnese] Iniciando geração da anamnese...");

    try {
      const patientInfo = {
        name: patient?.name,
        age: patient?.age,
        gender: patient?.gender,
        sex: patient?.sex,
        profession: patient?.profession,
        color: patient?.color,
        housing: patient?.housing,
        marital_status: patient?.marital_status,
        religion: patient?.religion,
      };

      const payload = {
        transcription: transcriptionText,
        transcriptionId: transcription.id,
        patientName: patientInfo.name,
        patientId: appointment.patient?.id,
        patientInfo,
        appointmentType: appointment.type,
        appointmentId: appointment.id,
        previousAnamnese,
        appointmentNotes,
      };

      console.log("[generateAnamnese] Enviando payload:", payload);

      const response = await fetch(
        `${envs.SUPABASE_HOST}/functions/v1/generate-medical-report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("[generateAnamnese] Erro na resposta:", errText);
        throw new Error("Erro ao gerar anamnese");
      }

      const anamneseResponse = await response.json();
      console.log("[generateAnamnese] Anamnese gerada:", anamneseResponse);

      setAnamnese(anamneseResponse);
      toast.success("Relatório gerado com sucesso.", "Anamnese pronta!");

      navigate(`/app/resumo?appointmentId=${appointment.id}`);
    } catch (e) {
      console.error("[generateAnamnese] Erro:", e);
      toast.error(String(e), "Erro ao gerar anamnese");
    } finally {
      setIsGeneratingAnamnese(false);
      console.log("[generateAnamnese] Finalizado.");
    }
  };

  const retrieveAnamnese = async (appointmentId: string) => {
    setIsRetrievingAnamnese(true);
    console.log(
      "[retrieveAnamnese] Buscando anamnese para o agendamento:",
      appointmentId
    );

    try {
      const response = await fetch(
        `${envs.SUPABASE_HOST}/functions/v1/retrieve-anamnese`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appointmentId }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("[retrieveAnamnese] Erro na resposta:", errText);
        throw new Error("Erro ao recuperar anamnese");
      }

      const retrievedAnamnese = await response.json();
      console.log("[retrieveAnamnese] Anamnese recuperada:", retrievedAnamnese);

      setAnamnese(retrievedAnamnese);
      toast.success("Relatório carregado com sucesso.", "Anamnese recuperada!");
    } catch (e) {
      console.error("[retrieveAnamnese] Erro:", e);
      toast.warning(null, "Erro ao recuperar anamnese");
    } finally {
      setIsRetrievingAnamnese(false);
      console.log("[retrieveAnamnese] Finalizado.");
    }
  };

  const retrieveLastAnamnese = async (patientId) => {
    setIsRetrievingAnamnese(true);
    console.log(
      "[retrieveLastAnamnese] Buscando última anamnese para paciente:",
      patientId
    );

    try {
      const response = await fetch(
        `${envs.SUPABASE_HOST}/retrieve-last-anamnese?patient_id=${patientId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("[retrieveLastAnamnese] Erro na resposta:", errText);
        throw new Error("Erro ao recuperar anamnese pelo ID do paciente");
      }

      const retrievedAnamnese = await response.json();
      console.log(
        "[retrieveLastAnamnese] Anamnese anterior recuperada:",
        retrievedAnamnese
      );

      setPreviousAnamnese(retrievedAnamnese);
      toast.success("Relatório carregado com sucesso.", "Anamnese recuperada!");
    } catch (error) {
      console.error("[retrieveLastAnamnese] Erro:", error);
      toast.error("Erro ao recuperar anamnese");
    } finally {
      setIsRetrievingAnamnese(false);
      console.log("[retrieveLastAnamnese] Finalizado.");
    }
  };

  const updateAnamnese = async (
    anamneseId: string,
    updatedData: IAnamneseMedicalPayload
  ) => {
    console.log(
      "[updateAnamnese] Atualizando anamnese:",
      anamneseId,
      updatedData
    );

    try {
      const response = await fetch(
        `${envs.SUPABASE_HOST}/functions/v1/update-anamnese-entry`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: anamneseId,
            data: updatedData,
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("[updateAnamnese] Erro na resposta:", errText);
        throw new Error("Erro ao atualizar anamnese");
      }

      setAnamnese((prev) => ({
        ...prev,
        ...updatedData,
      }));

      console.log("[updateAnamnese] Anamnese atualizada com sucesso.");
      toast.success(
        "As alterações foram salvas com sucesso.",
        "Anamnese atualizada!"
      );

      return { success: true };
    } catch (e) {
      console.error("[updateAnamnese] Erro:", e);
      toast.error(String(e), "Erro ao atualizar anamnese");
      return { success: false };
    }
  };

  return (
    <AnamneseContext.Provider
      value={{
        anamnese,
        previousAnamnese,
        isGeneratingAnamnese,
        isRetrievingAnamnese,
        generateAnamnese,
        retrieveAnamnese,
        retrieveLastAnamnese,
        updateAnamnese,
        setAppointmentNotes,
        appointmentNotes,
      }}
    >
      {children}
    </AnamneseContext.Provider>
  );
};

export const useAnamnese = () => {
  const ctx = useContext(AnamneseContext);
  if (!ctx) throw new Error("useAnamnese must be used within AnamneseProvider");
  return ctx;
};
