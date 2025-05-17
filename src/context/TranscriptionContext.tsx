
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import { usePatient } from "@/context/PatientContext";
import { useAppointment } from "@/context/AppointmentContext";
import { useStandardizedToast } from "@/hooks/use-standardized-toast";

export type RecordingStatus = "NOT_STARTED" | "RECORDING" | "PAUSED" | "STOPPED";

interface TranscriptionContextProps {
  transcription: string;
  setTranscription: (transcription: string) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  pauseRecording: () => void;
  appointmentType: string | null;
  setAppointmentType: (type: string | null) => void;
  isCreatingAppointment: boolean;
  createAppointment: () => Promise<any | null>;
  appointmentId: string | null;
  setIsCreatingAppointment: (isCreating: boolean) => void;
  resetContext: () => void;
  duration: number;
  recordingStatus: RecordingStatus;
  isTranscribing: boolean;
}

const TranscriptionContext = createContext<TranscriptionContextProps | undefined>(
  undefined
);

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (!context) {
    throw new Error(
      "useTranscription must be used within a TranscriptionProvider"
    );
  }
  return context;
};

export const TranscriptionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [appointmentType, setAppointmentType] = useState<string | null>(null);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>("NOT_STARTED");
  const [duration, setDuration] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const toast = useStandardizedToast();
  
  const { user } = useAuth();
  const { patient } = usePatient();
  const { setAppointment } = useAppointment();

  useEffect(() => {
    console.log("Transcription updated:", transcription);
  }, [transcription]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingStatus("RECORDING");
  };

  const pauseRecording = () => {
    setRecordingStatus(prevStatus => 
      prevStatus === "RECORDING" ? "PAUSED" : "RECORDING"
    );
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingStatus("STOPPED");
    setIsTranscribing(true);
    
    // Simulate transcription process - this would be replaced with actual API call
    setTimeout(() => {
      setIsTranscribing(false);
    }, 3000);
  };

  useEffect(() => {
    let interval: number | null = null;
    
    if (recordingStatus === "RECORDING") {
      interval = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [recordingStatus]);

  const resetContext = useCallback(() => {
    setTranscription("");
    setIsRecording(false);
    setRecordingStatus("NOT_STARTED");
    setAppointmentType(null);
    setIsCreatingAppointment(false);
    setAppointmentId(null);
    setAppointment(null);
    setDuration(0);
    setIsTranscribing(false);
  }, [setAppointment]);

  const createAppointment = async () => {
    try {
      if (!patient || !appointmentType) {
        toast.error(
          "Por favor, selecione um paciente e o tipo da consulta.",
          "Dados incompletos"
        );
        return null;
      }

      setIsCreatingAppointment(true);

      const newAppointment = {
        patient_id: patient.id,
        doctor_id: user?.id,
        type: appointmentType,
        created_at: new Date().toISOString(),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAppointment),
        }
      );

      if (!response.ok) {
        console.error("Error creating appointment:", response.statusText);
        toast.error(
          "Não foi possível criar o atendimento. Tente novamente.",
          "Erro"
        );
        return null;
      }

      const appointmentData = await response.json();
      setAppointmentId(appointmentData.id);
      setAppointment(appointmentData);
      toast.success(
        "Atendimento criado com sucesso!",
        "Novo atendimento iniciado"
      );
      return appointmentData;
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error(
        "Não foi possível criar o atendimento. Tente novamente.",
        "Erro"
      );
      return null;
    } finally {
      setIsCreatingAppointment(false);
    }
  };

  const value: TranscriptionContextProps = {
    transcription,
    setTranscription,
    isRecording,
    startRecording,
    stopRecording,
    pauseRecording,
    appointmentType,
    setAppointmentType,
    isCreatingAppointment,
    createAppointment,
    appointmentId,
    setIsCreatingAppointment,
    resetContext,
    duration,
    recordingStatus,
    isTranscribing
  };

  return (
    <TranscriptionContext.Provider value={value}>
      {children}
    </TranscriptionContext.Provider>
  );
};
