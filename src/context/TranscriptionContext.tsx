
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { envs } from "@/envs";

import { useAuth } from "./AuthContext";
import { useAppointment } from "./AppointmentContext";

interface Transcription {
  id: string;
  appointment_id: string;
  raw_text: string;
  segments?: Record<string, string>;
  errors: Record<string, string> | null;
  metadata: Record<string, unknown>;
  created_at: Date;
}

export type RecordingStatus =
  | "NOT_STARTED"
  | "RECORDING"
  | "STOPPED"
  | "PAUSED";

interface TranscriptionContextType {
  isTranscribing: boolean;
  recordingStatus: RecordingStatus;
  transcription: Transcription | null;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  pauseRecording: () => void;
}

const TranscriptionContext = createContext<
  TranscriptionContextType | undefined
>(undefined);

export const TranscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session } = useAuth();
  const { appointment } = useAppointment();
  const { toast } = useToast();

  const [recordingStatus, setRecordingStatus] =
    useState<RecordingStatus>("NOT_STARTED");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<Transcription | null>(
    null
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!appointment) return;
  });

  const startRecording = async () => {
    if (!appointment) {
      console.error("No appointment found: ", appointment);
      toast({
        title: "Não foi possível iniciar a consulta",
        description: "Tente novamente ou contate o suporte.",
      });

      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setRecordingStatus("RECORDING");
      toast({
        title: "Gravação iniciada",
        description: "Fale normalmente com o paciente.",
      });
    } catch (error) {
      toast({ title: "Erro ao iniciar gravação", description: String(error) });
    }
  };

  const stopRecording = async () => {
    return new Promise<void>((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.onstop = async () => {
          setRecordingStatus("STOPPED");
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/webm",
          });
          await transcribeAudio(audioBlob);
          resolve();
        };
        mediaRecorder.stop();
      } else {
        resolve();
      }
    });
  };

  const pauseRecording = () => {
    if (recordingStatus === "PAUSED") {
      setRecordingStatus("RECORDING");
      toast({
        title: "Escuta retomada",
        description: "A Ally voltou a registrar sua consulta.",
      });
    } else {
      setRecordingStatus("PAUSED");
      toast({
        title: "Escuta pausada",
        description: "A Ally pausou o registro da consulta temporariamente.",
      });
    }
  };

  const transcribeAudio = async (
    audioBlob: Blob
  ): Promise<Transcription | null> => {
    setIsTranscribing(true);
    try {
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64 = (reader.result as string)?.split(",")[1];
          base64 ? resolve(base64) : reject("Erro na conversão do áudio");
        };
      });

      // Add consultation notes if available
      const consultationNotes = localStorage.getItem("consultationNotes") || "";

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
            appointmentId: appointment.id,
            consultationNotes: consultationNotes, // Pass notes to the transcription service
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro na transcrição");
      }

      const { data: transcription } = await res.json();

      // Clear consultation notes from localStorage after successful transcription
      localStorage.removeItem("consultationNotes");

      setTranscription(transcription);
      return transcription;
    } catch (e) {
      toast({ title: "Erro na transcrição", description: String(e) });
      return null;
    } finally {
      setIsTranscribing(false);
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (recordingStatus === "RECORDING") {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [recordingStatus]);

  return (
    <TranscriptionContext.Provider
      value={{
        transcription,
        isTranscribing,
        recordingStatus,
        duration,
        startRecording,
        stopRecording,
        pauseRecording,
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
