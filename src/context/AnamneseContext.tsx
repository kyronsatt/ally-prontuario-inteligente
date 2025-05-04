import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { envs } from "@/envs";
import { toast } from "@/components/ui/sonner";

import { useAppointment } from "./AppointmentContext";
import { useAuth } from "./AuthContext";
import { useTranscription } from "./TranscriptionContext";
import { usePatient } from "./PatientContext";

interface AnamneseContextType {
  anamnese: IAnamnese | null;
  isGeneratingAnamnese: boolean;
  isRetrievingAnamnese: boolean;
  generateAnamnese: (transcription: string) => Promise<void>;
  retrieveAnamnese: (appointmentId: string) => Promise<void>;
  updateAnamnese: (
    anamneseId: string,
    updatedData: IAnamneseMedicalPayload
  ) => Promise<{ success: boolean }>;
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
  created_by: string;
  created_at: Date;
}

const AnamneseContext = createContext<AnamneseContextType | undefined>(
  undefined
);

export const AnamneseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { appointment, setAppointment } = useAppointment();
  const { transcription } = useTranscription();
  const { patient } = usePatient();

  const [isGeneratingAnamnese, setIsGeneratingAnamnese] = useState(false);
  const [isRetrievingAnamnese, setIsRetrievingAnamnese] = useState(false);
  const [anamnese, setAnamnese] = useState<IAnamnese | null>(null);

  const getPreviousAnamnese = async (patientId: string) => {
    try {
      const { data, error } = await fetch(
        `${envs.SUPABASE_HOST}/functions/v1/get-previous-anamnese`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patientId }),
        }
      ).then((res) => res.json());

      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Erro ao obter anamnese anterior:", e);
      return null;
    }
  };

  const generateAnamnese = async (transcriptionText: string) => {
    setIsGeneratingAnamnese(true);
    try {
      let previousAnamnese = null;

      // Get previous anamnese if this is a return appointment
      if (appointment.type === "RETURN" && appointment.patient?.id) {
        previousAnamnese = await getPreviousAnamnese(appointment.patient.id);
      }

      // Get extended patient information
      const patientInfo = {
        name: patient?.name || appointment.patient?.name,
        age: patient?.age || appointment.patient?.age,
        gender: patient?.gender || appointment.patient?.gender,
        sex: patient?.sex || "NOT_PROVIDED",
        profession: patient?.profession || "NOT_PROVIDED",
        color: patient?.color || "NOT_PROVIDED",
        housing: patient?.housing || "NOT_PROVIDED",
        maritalStatus: patient?.maritalStatus || "NOT_PROVIDED",
        religion: patient?.religion || "NOT_PROVIDED",
      };

      const response = await fetch(
        `${envs.SUPABASE_HOST}/functions/v1/generate-medical-report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcription: transcriptionText,
            transcriptionId: transcription.id,
            patientName: patientInfo.name,
            patientId: appointment.patient?.id,
            patientInfo: patientInfo,
            appointmentType: appointment.type,
            appointmentId: appointment.id,
            previousAnamnese: previousAnamnese,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao gerar anamnese");
      }

      const anamneseResponse = await response.json();
      setAnamnese(anamneseResponse);

      toast("Anamnese pronta!", {
        description: "Relatório gerado com sucesso.",
      });

      // Navigate to the anamnese visualization page
      navigate(`/app/resumo?appointmentId=${appointment.id}`);
    } catch (e) {
      toast("Erro ao gerar anamnese", { description: String(e) });
    } finally {
      setIsGeneratingAnamnese(false);
    }
  };

  const retrieveAnamnese = async (appointmentId: string) => {
    setIsRetrievingAnamnese(true);
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
        throw new Error("Erro ao recuperar anamnese");
      }

      const retrievedAnamnese = await response.json();
      setAnamnese(retrievedAnamnese);

      toast("Anamnese recuperada!", {
        description: "Relatório carregado com sucesso.",
      });
    } catch (e) {
      toast("Erro ao recuperar anamnese", { description: String(e) });
    } finally {
      setIsRetrievingAnamnese(false);
    }
  };

  const updateAnamnese = async (
    anamneseId: string,
    updatedData: IAnamneseMedicalPayload
  ) => {
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
        throw new Error("Erro ao atualizar anamnese");
      }

      const updatedAnamnese = await response.json();
      setAnamnese((prev) => ({
        ...prev,
        ...updatedData,
      }));

      toast("Anamnese atualizada!", {
        description: "As alterações foram salvas com sucesso.",
      });

      return updatedAnamnese;
    } catch (e) {
      toast("Erro ao atualizar anamnese", { description: String(e) });
      console.error("Erro ao atualizar anamnese:", e);
      return null;
    }
  };

  return (
    <AnamneseContext.Provider
      value={{
        anamnese,
        isGeneratingAnamnese,
        isRetrievingAnamnese,
        generateAnamnese,
        retrieveAnamnese,
        updateAnamnese,
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
