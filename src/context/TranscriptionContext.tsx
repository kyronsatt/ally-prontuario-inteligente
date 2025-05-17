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
import { toast } from "@/hooks/use-standardized-toast";

interface TranscriptionContextProps {
  transcription: string;
  setTranscription: (transcription: string) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  appointmentType: string | null;
  setAppointmentType: (type: string | null) => void;
  isCreatingAppointment: boolean;
  createAppointment: () => Promise<any | null>;
  appointmentId: string | null;
  setIsCreatingAppointment: (isCreating: boolean) => void;
  resetContext: () => void;
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
  const { user } = useAuth();
  const { patient } = usePatient();
  const { setAppointment } = useAppointment();

  useEffect(() => {
    console.log("Transcription updated:", transcription);
  }, [transcription]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const resetContext = useCallback(() => {
    setTranscription("");
    setIsRecording(false);
    setAppointmentType(null);
    setIsCreatingAppointment(false);
    setAppointmentId(null);
    setAppointment(null);
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
    appointmentType,
    setAppointmentType,
    isCreatingAppointment,
    createAppointment,
    appointmentId,
    setIsCreatingAppointment,
    resetContext,
  };

  return (
    <TranscriptionContext.Provider value={value}>
      {children}
    </TranscriptionContext.Provider>
  );
};
