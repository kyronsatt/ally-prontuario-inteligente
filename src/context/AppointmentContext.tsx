
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { PatientData } from "./PatientContext";
import { toast } from "@/components/ui/sonner";

export type AppointmentType = "NEW" | "RETURN";

interface IAppointmentCreationPayload {
  patient_id: string;
  doctor_id: string;
  type: AppointmentType;
}

export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface AnamneseNote {
  queixaPrincipal: string;
  historiaDoencaAtual: string;
  antecedentesPatologicos: string;
  medicacoesEmUso: string;
  habitosDeVida: string;
  examesFisicos: string;
  examesComplementares: string;
  diagnostico: string;
  conduta: string;
}

export interface AppointmentData extends IAppointmentCreationPayload {
  id: string;
  created_at: Date;
  date?: Date;
  patient?: PatientData;
  audioBlob?: Blob;
  transcription?: string;
  soapNote?: SoapNote;
  anamneseNote?: AnamneseNote;
  selectedFormat?: string;
}

interface IAppointmentCreationResponse {
  appointment: AppointmentData;
  patient: PatientData;
}

interface AppointmentContextType {
  appointment: AppointmentData;
  setAppointment: React.Dispatch<React.SetStateAction<AppointmentData>>;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetAppointment: () => void;
  createAppointment: (
    appointmentCreationPayload: IAppointmentCreationPayload
  ) => Promise<IAppointmentCreationResponse>;
  processAudio: (audioBlob: Blob) => Promise<void>;
  isProcessing: boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

// Default empty appointment for resetting
const defaultAppointment: AppointmentData = {
  id: "",
  patient_id: "",
  doctor_id: "",
  type: "NEW",
  created_at: new Date(),
};

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appointment, setAppointment] = useState<AppointmentData>(defaultAppointment);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { session } = useAuth();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      setAudioChunks([]);
      
      recorder.ondataavailable = (e) => {
        setAudioChunks((prev) => [...prev, e.data]);
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsListening(true);
      
      toast("Escuta iniciada", {
        description: "A Ally está ouvindo sua consulta com segurança.",
      });
    } catch (error) {
      console.error("Erro ao iniciar gravação:", error);
      toast("Erro ao iniciar gravação", {
        description: "Verifique se o microfone está disponível e tente novamente.",
        status: "error",
      });
    }
  };

  const stopListening = () => {
    if (mediaRecorder && isListening) {
      mediaRecorder.stop();
      
      // Get all tracks from stream and stop them
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      // Finalize recording when data is available
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        setAppointment(prev => ({
          ...prev,
          audioBlob,
          date: new Date(),
        }));
        
        setIsListening(false);
        toast("Gravação finalizada", {
          description: "Áudio capturado com sucesso.",
        });
        
        // Process the audio automatically
        await processAudio(audioBlob);
      };
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    toast("Processando áudio", {
      description: "Convertendo áudio para texto...",
    });
    
    try {
      // Convert audio to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      const base64Audio = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Remove data URL prefix (data:audio/webm;base64,)
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
      });
      
      // Step 1: Transcribe Audio
      const transcriptionResponse = await fetch(
        "https://qvcdczmigjsvrxmiryos.supabase.co/functions/v1/transcribe-audio",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audio: base64Audio }),
        }
      );
      
      if (!transcriptionResponse.ok) {
        const errorData = await transcriptionResponse.json();
        throw new Error(errorData.error || "Erro na transcrição do áudio");
      }
      
      const transcriptionResult = await transcriptionResponse.json();
      const transcription = transcriptionResult.text;
      
      // Update appointment with transcription
      setAppointment(prev => ({
        ...prev,
        transcription,
      }));
      
      toast("Áudio transcrito", {
        description: "Gerando relatório médico...",
      });
      
      // Step 2: Generate Medical Report
      const reportResponse = await fetch(
        "https://qvcdczmigjsvrxmiryos.supabase.co/functions/v1/generate-medical-report",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            transcription,
            patientName: appointment.patient?.name,
            appointmentType: appointment.type,
          }),
        }
      );
      
      if (!reportResponse.ok) {
        const errorData = await reportResponse.json();
        throw new Error(errorData.error || "Erro na geração do relatório médico");
      }
      
      const reportResult = await reportResponse.json();
      
      // Update appointment with SOAP and Anamnese notes
      setAppointment(prev => ({
        ...prev,
        transcription,
        soapNote: reportResult.soapNote,
        anamneseNote: reportResult.anamneseNote,
      }));
      
      toast("Relatório gerado", {
        description: "Relatório médico gerado com sucesso!",
      });
      
    } catch (error) {
      console.error("Erro no processamento:", error);
      toast("Erro no processamento", {
        description: "Ocorreu um erro ao processar o áudio. Por favor, tente novamente.",
        status: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAppointment = () => {
    setAppointment(defaultAppointment);
    setIsListening(false);
    setIsProcessing(false);
    if (mediaRecorder) {
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setMediaRecorder(null);
    }
    setAudioChunks([]);
  };

  const createAppointment = async (
    appointmentCreationPayload: IAppointmentCreationPayload
  ) => {
    const response = await fetch(
      "https://qvcdczmigjsvrxmiryos.supabase.co/functions/v1/create-appointment",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentCreationPayload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating appointment:", errorData.error);
      throw new Error(errorData.error || "Error creating appointment");
    } else {
      const result = (await response.json()) as IAppointmentCreationResponse;
      console.log("Appointment created successfully:", result);
      setAppointment(result.appointment);

      return result;
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointment,
        setAppointment,
        isListening,
        startListening,
        stopListening,
        resetAppointment,
        createAppointment,
        processAudio,
        isProcessing,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error(
      "useAppointment must be used within an AppointmentProvider"
    );
  }
  return context;
};
