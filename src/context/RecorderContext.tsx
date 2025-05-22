// hooks/useRecorder.ts
import { createContext, useContext, useRef, useState, useEffect } from "react";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import { useToast } from "@/hooks/use-toast";

export type RecordingStatus =
  | "NOT_STARTED"
  | "RECORDING"
  | "PAUSED"
  | "STOPPED"
  | "ERROR";

interface RecorderContextProps {
  status: RecordingStatus;
  duration: number;
  startRecording: () => Promise<void>;
  pauseRecording: () => void;
  stopRecording: (
    onStop?: (blob: Blob, duration: number) => Promise<void>
  ) => Promise<Blob | null>;
}

const RecorderContext = createContext<RecorderContextProps | undefined>(
  undefined
);

export const RecorderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toast = useToast();
  const [status, setStatus] = useState<RecordingStatus>("NOT_STARTED");
  const [duration, setDuration] = useState(0);
  const recorderRef = useRef<RecordRTC | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const checkMicrophonePermissionStatus = async () => {
    if (!navigator.permissions) return null;

    try {
      const status = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      return status.state; // 'granted', 'denied', or 'prompt'
    } catch {
      return null;
    }
  };

  const ensureMicrophonePermission = async () => {
    const status = await checkMicrophonePermissionStatus();

    if (status === "granted") {
      return true;
    } else if (status === "denied") {
      toast.error(
        "Permissão de uso do microfone negada anteriormente. Altere nas configurações do navegador.",
        "Sem permissão de microfone"
      );
      return false;
    } else {
      return await requestMicrophonePermission();
    }
  };

  const requestMicrophonePermission = async () => {
    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      toast.error(
        "Seu navegador não suporta acesso ao microfone. Tente outro.",
        "Navegador não suportado"
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Libere imediatamente após concedida, se só quer a permissão
      stream.getTracks().forEach((track) => track.stop());

      toast.success(null, "Permissão para o microfone concedida!");
      return true;
    } catch (error) {
      if (error.name === "NotAllowedError") {
        toast.error(null, "Permissão para o microfone negada.");
      } else if (error.name === "NotFoundError") {
        toast.error(null, "Nenhum microfone disponível.");
      } else {
        toast.error(null, "Erro ao solicitar microfone.");
      }
      console.error(error);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      const micPermission = await ensureMicrophonePermission();
      if (!micPermission) {
        setStatus("NOT_STARTED");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
        recorderType: StereoAudioRecorder,
        numberOfAudioChannels: 1,
      });

      recorderRef.current = recorder;
      recorder.startRecording();
      setStatus("RECORDING");
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      toast.success("Gravação iniciada", "Fale normalmente com o paciente.");
    } catch (err) {
      toast.error(null, "Erro ao iniciar gravação de áudio");
      console.error("Erro ao iniciar gravação:", err);
      setStatus("ERROR");
    }
  };

  const pauseRecording = () => {
    const recorder = recorderRef.current;
    if (!recorder) return;

    if (status === "RECORDING") {
      recorder.pauseRecording();
      setStatus("PAUSED");
      toast.info(
        "A Ally pausou o registro da consulta temporariamente.",
        "Escuta pausada"
      );
    } else if (status === "PAUSED") {
      recorder.resumeRecording();
      setStatus("RECORDING");
      toast.info("A Ally voltou a registrar sua consulta.", "Escuta retomada");
    }
  };

  const stopRecording = (
    onStop?: (blob: Blob, duration: number) => Promise<void>
  ): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder) {
        console.warn("[Recorder] No active recorder to stop.");
        return resolve(null);
      }

      recorder.stopRecording(async () => {
        clearInterval(timerRef.current!);
        setStatus("STOPPED");

        const blob = recorder.getBlob();
        try {
          recorder.destroy();
          recorderRef.current = null;

          console.log("[Recorder] Recording stopped.");
          console.log("[Recorder] Blob size (bytes):", blob?.size);
          console.log("[Recorder] Duration (s):", duration);

          if (blob && duration && onStop) {
            onStop(blob, duration);
          }

          resolve(blob);
        } catch (error) {
          console.error("Erro ao calcular duração do áudio:", error);
          toast.error(null, "Erro ao calcular duração do áudio.");
          resolve(blob);
          setStatus("ERROR");
        }
      });
    });
  };

  useEffect(() => {
    return () => {
      recorderRef.current?.destroy();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <RecorderContext.Provider
      value={{
        status,
        duration,
        startRecording,
        pauseRecording,
        stopRecording,
      }}
    >
      {children}
    </RecorderContext.Provider>
  );
};

export const useRecorder = () => {
  const ctx = useContext(RecorderContext);
  if (!ctx) throw new Error("useRecorder must be used within RecorderProvider");
  return ctx;
};
