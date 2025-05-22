// contexts/TranscriptionProvider.tsx
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { useAppointment } from "./AppointmentContext";
import { supabase } from "@/integrations/supabase/client";
import { envs } from "@/envs";
import { useToast } from "@/hooks/use-toast";

interface Transcription {
  id: string;
  appointment_id: string;
  raw_text: string;
  segments?: Record<string, string>;
  errors: Record<string, string> | null;
  metadata: Record<string, unknown>;
  created_at: Date;
}

interface TranscriptionContextProps {
  transcription: Transcription | null;
  isTranscribing: boolean;
  transcribeAudio: (audioBlob: Blob, duration: number) => Promise<void>;
}

const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = (reader.result as string)?.split(",")[1];
      if (base64) resolve(base64);
      else reject("Falha ao converter áudio para base64");
    };

    reader.onerror = (e) => {
      console.error("[BlobToBase64] Erro no FileReader:", e);
      reject("Erro na leitura do arquivo de áudio.");
    };

    reader.readAsDataURL(blob);
  });
};

const TranscriptionContext = createContext<
  TranscriptionContextProps | undefined
>(undefined);

export const TranscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toast = useToast();
  const { appointment } = useAppointment();
  const { session } = useAuth();

  const [transcription, setTranscription] = useState<Transcription | null>(
    null
  );
  const [isTranscribing, setIsTranscribing] = useState(false);

  const transcribeAudio = async (
    audioBlob: Blob,
    duration: number
  ): Promise<void> => {
    setIsTranscribing(true);
    console.log("[Transcription] Iniciando transcrição de áudio...");

    try {
      const base64Audio = await convertBlobToBase64(audioBlob);
      console.log("[Transcription] Áudio convertido para base64 com sucesso.");

      const notes = localStorage.getItem("appointmentNotes") || "";
      console.log("[Transcription] Notas recuperadas do localStorage:", notes);

      const response = await fetch(
        `${envs.SUPABASE_HOST}/functions/v1/transcribe-audio`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audio: base64Audio,
            appointmentId: appointment?.id,
            appointmentNotes: notes,
            duration,
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("[Transcription] Erro na resposta:", errorResponse);
        throw new Error(
          errorResponse.error || "Erro desconhecido na transcrição"
        );
      }

      const { data } = await response.json();
      console.log("[Transcription] Transcrição recebida com sucesso:", data);

      localStorage.removeItem("appointmentNotes");
      setTranscription(data);
      toast.success(null, "Transcrição concluída com sucesso!");
    } catch (error) {
      console.error("[Transcription] Erro durante a transcrição:", error);
      toast.error(null, "Erro ao transcrever áudio.");
    } finally {
      setIsTranscribing(false);
      console.log("[Transcription] Transcrição finalizada.");
    }
  };

  return (
    <TranscriptionContext.Provider
      value={{
        transcription,
        isTranscribing,
        transcribeAudio,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};

export const useTranscription = () => {
  const ctx = useContext(TranscriptionContext);
  if (!ctx)
    throw new Error(
      "useTranscription must be used within TranscriptionProvider"
    );
  return ctx;
};
