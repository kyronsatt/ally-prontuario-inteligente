import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { envs } from "@/envs";
import { toast } from "@/components/ui/sonner";

import { useAppointment } from "./AppointmentContext";
import { useAuth } from "./AuthContext";
import { useTranscription } from "./TranscriptionContext";

interface AnamneseContextType {
  anamnese: IAnamnese | null;
  isGeneratingAnamnese: boolean;
  generateAnamnese: (transcription: string) => Promise<void>;
}

export interface IAnamnese {
  id: string;
  appointment_id: string;
  transcription_id: string;
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

  const { appointment } = useAppointment();
  const { transcription } = useTranscription();

  const [isGeneratingAnamnese, setIsGeneratingAnamnese] = useState(false);
  const [anamnese, setAnamnese] = useState<IAnamnese | null>(null);

  const generateAnamnese = async () => {
    setIsGeneratingAnamnese(true);
    try {
      const response = await fetch(
        `${envs.SUPABASE_HOST}/functions/v1/generate-medical-report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcription: transcription.raw_text,
            transcriptionId: transcription.id,
            patientName: appointment.patient?.name,
            appointmentType: appointment.type,
            appointmentId: appointment.id,
          }),
        }
      );

      if (!response) {
        throw new Error("Erro ao gerar anamnese");
      }

      const anamnese = await response.json();
      setAnamnese(anamnese);

      toast("Anamnese pronta!", {
        description: "Relatório gerado com sucesso.",
      });
    } catch (e) {
      toast("Erro ao gerar anamnese", { description: String(e) });
    } finally {
      setIsGeneratingAnamnese(false);
    }
  };

  return (
    <AnamneseContext.Provider
      value={{ anamnese, isGeneratingAnamnese, generateAnamnese }}
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
