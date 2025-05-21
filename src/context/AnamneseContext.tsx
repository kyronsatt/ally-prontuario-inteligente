import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useStandardizedToast } from "@/hooks/use-standardized-toast";
import { IAnamnese, AnamneseEntry, InsightItem, AnamneseDBEntry } from "@/types/anamnese";
import { Json } from "@/integrations/supabase/types";

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
  const toast = useStandardizedToast();

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
          // Convert DB data to AnamneseEntry format
          const entries = data.map((entry: AnamneseDBEntry) => ({
            id: entry.id,
            title: entry.title || "",
            content: entry.content || "",
            type: entry.type || "",
            appointment_id: entry.appointment_id
          }));
          
          setAnamneseEntries(entries);
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
  }, [params.appointmentId, toast]);

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
          // Insert new entry with required fields
          const { error } = await supabase
            .from("anamnese")
            .insert([
              {
                title: entry.title,
                content: entry.content,
                type: entry.type,
                appointment_id: params.appointmentId,
                created_by: "user" // Add a default value or get from auth context
              }
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
        // Convert JSON insights to InsightItem[]
        const anamneseData = data[0];
        const insights = Array.isArray(anamneseData.insights) 
          ? anamneseData.insights.map((item: any) => ({
              id: item.id || "",
              label: item.label || "",
              content: item.content || "",
              type: item.type || ""
            }))
          : [];

        // Convert database record to IAnamnese
        const convertedAnamnese: IAnamnese = {
          ...anamneseData,
          insights
        };
        
        setPreviousAnamnese(convertedAnamnese);
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

      // Get anamnese with the specified appointment_id
      const { data: anamneseData, error: anamneseError } = await supabase
        .from("anamnese")
        .select("*, patient:patient_id(id, name)")
        .eq("appointment_id", appointmentId)
        .single();

      if (anamneseError || !anamneseData) {
        console.error("Error retrieving anamnese:", anamneseError);
        setAnamnese(null);
        setIsRetrievingAnamnese(false);
        return { success: false, data: null };
      }

      // Process insights data from JSON to object if needed
      let processedAnamnese: IAnamnese;
      if (typeof anamneseData.insights === "string") {
        try {
          const parsedInsights = JSON.parse(anamneseData.insights);
          processedAnamnese = {
            ...anamneseData,
            insights: parsedInsights as InsightItem[]
          } as IAnamnese;
        } catch (e) {
          processedAnamnese = {
            ...anamneseData,
            insights: [] as InsightItem[]
          } as IAnamnese;
        }
      } else {
        // Handle insights as an array or empty array if null/undefined
        processedAnamnese = {
          ...anamneseData,
          insights: Array.isArray(anamneseData.insights) ? anamneseData.insights : []
        } as IAnamnese;
      }

      setAnamnese(processedAnamnese);
      setIsRetrievingAnamnese(false);
      return { success: true, data: processedAnamnese };
    } catch (error) {
      console.error("Error retrieving anamnese:", error);
      setAnamnese(null);
      setIsRetrievingAnamnese(false);
      return { success: false, data: null };
    }
  };

  const updateAnamnese = async (id: string, anamneseUpdate: Partial<IAnamnese>) => {
    try {
      setIsSubmittingAnamnese(true);
      
      // Convert insights to a format compatible with Supabase's JSON column
      const formattedUpdate: Record<string, any> = { ...anamneseUpdate };
      
      // Convert InsightItem[] to JSON compatible format
      if (formattedUpdate.insights) {
        formattedUpdate.insights = formattedUpdate.insights as any;
      }
      
      const { error } = await supabase
        .from("anamnese")
        .update(formattedUpdate)
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

  // Add anamnese_entries to the Supabase database tables
  const inserAnamneseEntry = async (entry: AnamneseDBEntry): Promise<{ success: boolean; data: any; error: any }> => {
    try {
      // Convert the entry to the expected format for Supabase
      const dbEntry = {
        appointment_id: entry.appointment_id,
        title: entry.title || "",
        type: entry.type || "",
        // Use stringified content for text fields
        content: JSON.stringify(entry.content || ""),
        created_by: entry.created_by || "",
      };

      const { data, error } = await supabase
        .from("anamnese_entries")
        .insert(dbEntry);

      return { success: !error, data, error };
    } catch (error) {
      console.error("Error inserting anamnese entry:", error);
      return { success: false, data: null, error };
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
