// contexts/TranscriptionProvider.tsx
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { useAppointment } from "./AppointmentContext";
import { supabase } from "@/integrations/supabase/client";
import { envs } from "@/envs";
import { toast } from "@/hooks/use-standardized-toast";

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

const TranscriptionContext = createContext<
  TranscriptionContextProps | undefined
>(undefined);

export const TranscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

    try {
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64 = (reader.result as string)?.split(",")[1];
          base64 ? resolve(base64) : reject("Erro na conversão");
        };
      });

      const notes = localStorage.getItem("appointmentNotes") || "";

      const res = await fetch(
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

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro na transcrição");
      }

      const { data } = await res.json();
      localStorage.removeItem("appointmentNotes");
      setTranscription(data);
    } catch (err) {
      console.error("Erro na transcrição:", err);
      toast.error(null, "Erro ao transcrever áudio.");
    } finally {
      setIsTranscribing(false);
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
