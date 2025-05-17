
import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-standardized-toast";

// Define interfaces for context types
export interface InsightItem {
  id?: string;
  label: string;
  content: string;
  type: string;
}

export interface IAnamnese {
  id?: string;
  appointment_id?: string;
  transcription_id?: string;
  created_at?: string;
  patient_id?: string;
  insights?: InsightItem[];
  patient?: {
    id?: string;
    name?: string;
  };
  identification: string;
  main_complaint: string;
  current_illness_history: string;
  past_medical_history: string;
  social_history: string;
  family_history: string;
  physical_exams: string;
  complementary_exams: string;
  diagnostic_hypotheses: string;
  therapeutic_approach: string;
  [key: string]: any; // For dynamic access to properties
}

interface AnamneseEntry {
  id?: string;
  title: string;
  content: string;
  type: string;
  created_at?: string;
  appointment_id?: string;
}

interface AnamneseContextProps {
  anamnese: IAnamnese | null;
  setAnamnese: React.Dispatch<React.SetStateAction<IAnamnese | null>>;
  previousAnamnese: IAnamnese | null;
  appointmentNotes: string;
  setAppointmentNotes: React.Dispatch<React.SetStateAction<string>>;
  isRetrievingAnamnese: boolean;
  retrieveLastAnamnese: (patientId: string) => Promise<void>;
  anamnese_entries: AnamneseEntry[];
  setAnamneseEntries: React.Dispatch<React.SetStateAction<AnamneseEntry[]>>;
  isSubmittingAnamnese: boolean;
  addAnamneseEntry: (entry: AnamneseEntry) => void;
  updateAnamneseEntry: (id: string, content: string) => void;
  submitAnamnese: () => Promise<void>;
  // Added these methods to fix the AppointmentSummary errors
  isGeneratingAnamnese: boolean;
  generateAnamnese: (transcription: string) => Promise<void>;
  retrieveAnamnese: (appointmentId: string) => Promise<void>;
  updateAnamnese: (id: string, anamnese: Partial<IAnamnese>) => Promise<{ success: boolean }>;
}

const AnamneseContext = createContext<AnamneseContextProps | undefined>(
  undefined
);

export const useAnamnese = () => {
  const context = useContext(AnamneseContext);
  if (!context) {
    throw new Error("useAnamnese must be used within a AnamneseProvider");
  }
  return context;
};

interface AnamneseProviderProps {
  children: React.ReactNode;
}

export const AnamneseProvider: React.FC<AnamneseProviderProps> = ({
  children,
}) => {
  const [anamnese, setAnamnese] = useState<IAnamnese | null>(null);
  const [previousAnamnese, setPreviousAnamnese] = useState<IAnamnese | null>(null);
  const [appointmentNotes, setAppointmentNotes] = useState<string>("");
  const [anamnese_entries, setAnamneseEntries] = useState<AnamneseEntry[]>([]);
  const [isRetrievingAnamnese, setIsRetrievingAnamnese] = useState<boolean>(false);
  const [isGeneratingAnamnese, setIsGeneratingAnamnese] = useState<boolean>(false);
  const [isSubmittingAnamnese, setIsSubmittingAnamnese] = useState<boolean>(false);
  const params = useParams();

  // For handling anamnese entries
  useEffect(() => {
    const fetchAnamnese = async () => {
      if (!params.appointmentId) return;

      try {
        setIsRetrievingAnamnese(true);
        // Fetch anamnese data for this appointment
        const { data, error } = await supabase
          .from("anamnese")
          .select("*")
          .eq("appointment_id", params.appointmentId)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setAnamneseEntries(data as any);
        }
      } catch (error: any) {
        console.error("Error fetching anamnese:", error.message);
        toast.error("Erro ao carregar anamnese");
      } finally {
        setIsRetrievingAnamnese(false);
      }
    };

    if (params.appointmentId) {
      fetchAnamnese();
    }
  }, [params.appointmentId]);

  const addAnamneseEntry = (entry: AnamneseEntry) => {
    setAnamneseEntries((prev) => [...prev, entry]);
  };

  const updateAnamneseEntry = (id: string, content: string) => {
    setAnamneseEntries((prev) =>
      prev.map((entry) => {
        if (entry.id === id) {
          return { ...entry, content };
        }
        return entry;
      })
    );
  };

  const submitAnamnese = async () => {
    if (!params.appointmentId) {
      toast.error("ID da consulta não encontrado");
      return;
    }

    try {
      setIsSubmittingAnamnese(true);

      // First, check if there are any entries to submit
      if (anamnese_entries.length === 0) {
        toast.info("Nenhuma entrada de anamnese para salvar");
        return;
      }

      const updatePromises = anamnese_entries.map(async (entry) => {
        if (entry.id) {
          // Update existing entry
          const { error } = await supabase
            .from("anamnese")
            .update({ content: entry.content })
            .eq("id", entry.id);

          if (error) throw error;
        } else {
          // Insert new entry
          const { error } = await supabase.from("anamnese").insert([
            {
              title: entry.title,
              content: entry.content,
              type: entry.type,
              appointment_id: params.appointmentId,
            },
          ]);

          if (error) throw error;
        }
      });

      await Promise.all(updatePromises);
      toast.success("Anamnese salva com sucesso");
    } catch (error: any) {
      console.error("Error submitting anamnese:", error.message);
      toast.error("Erro ao salvar anamnese");
    } finally {
      setIsSubmittingAnamnese(false);
    }
  };

  // Added these methods to fix the AppointmentSummary errors
  const retrieveLastAnamnese = async (patientId: string) => {
    try {
      setIsRetrievingAnamnese(true);
      // This should be implemented to retrieve the last anamnese for the patient
      const { data, error } = await supabase
        .from("anamnese")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setPreviousAnamnese(data[0] as any);
      }
    } catch (error: any) {
      console.error("Error retrieving last anamnese:", error.message);
      toast.error("Erro ao buscar última anamnese");
    } finally {
      setIsRetrievingAnamnese(false);
    }
  };

  const generateAnamnese = async (transcription: string) => {
    try {
      setIsGeneratingAnamnese(true);
      // This would typically call an API to generate the anamnese
      // For now, we'll set a mock anamnese
      setAnamnese({
        id: "mock-id",
        identification: "Identificação do paciente",
        main_complaint: "Queixa principal",
        current_illness_history: "História da doença atual",
        past_medical_history: "História médica passada",
        social_history: "História social",
        family_history: "História familiar",
        physical_exams: "Exames físicos",
        complementary_exams: "Exames complementares",
        diagnostic_hypotheses: "Hipóteses diagnósticas",
        therapeutic_approach: "Abordagem terapêutica",
        insights: [],
        patient: {
          name: "Paciente de Exemplo"
        }
      });
    } catch (error: any) {
      console.error("Error generating anamnese:", error.message);
      toast.error("Erro ao gerar anamnese");
    } finally {
      setIsGeneratingAnamnese(false);
    }
  };

  const retrieveAnamnese = async (appointmentId: string) => {
    try {
      setIsRetrievingAnamnese(true);
      // This should be implemented to retrieve the anamnese for the appointment
      const { data, error } = await supabase
        .from("anamnese")
        .select("*")
        .eq("appointment_id", appointmentId)
        .single();

      if (error) throw error;

      if (data) {
        setAnamnese(data as any);
      }
    } catch (error: any) {
      console.error("Error retrieving anamnese:", error.message);
      toast.error("Erro ao buscar anamnese");
    } finally {
      setIsRetrievingAnamnese(false);
    }
  };

  const updateAnamnese = async (id: string, anamneseUpdate: Partial<IAnamnese>) => {
    try {
      setIsSubmittingAnamnese(true);
      
      const { error } = await supabase
        .from("anamnese")
        .update(anamneseUpdate)
        .eq("id", id);

      if (error) throw error;

      // Update the local anamnese state
      setAnamnese(prev => prev ? { ...prev, ...anamneseUpdate } : null);
      
      return { success: true };
    } catch (error: any) {
      console.error("Error updating anamnese:", error.message);
      toast.error("Erro ao atualizar anamnese");
      return { success: false };
    } finally {
      setIsSubmittingAnamnese(false);
    }
  };

  return (
    <AnamneseContext.Provider
      value={{
        anamnese,
        setAnamnese,
        previousAnamnese,
        appointmentNotes,
        setAppointmentNotes,
        isRetrievingAnamnese,
        retrieveLastAnamnese,
        anamnese_entries,
        setAnamneseEntries,
        isSubmittingAnamnese,
        addAnamneseEntry,
        updateAnamneseEntry,
        submitAnamnese,
        // Added these to fix the AppointmentSummary errors
        isGeneratingAnamnese,
        generateAnamnese,
        retrieveAnamnese,
        updateAnamnese
      }}
    >
      {children}
    </AnamneseContext.Provider>
  );
};
