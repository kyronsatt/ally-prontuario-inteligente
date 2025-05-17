
import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-standardized-toast";

// Define interfaces for context types
interface AnamneseEntry {
  id?: string;
  title: string;
  content: string;
  type: string;
  created_at?: string;
  appointment_id?: string;
}

interface AnamneseContextProps {
  anamnese: AnamneseEntry[];
  setAnamnese: React.Dispatch<React.SetStateAction<AnamneseEntry[]>>;
  isAnamneseLoading: boolean;
  isSubmittingAnamnese: boolean;
  addAnamneseEntry: (entry: AnamneseEntry) => void;
  updateAnamneseEntry: (id: string, content: string) => void;
  submitAnamnese: () => Promise<void>;
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
  const [anamnese, setAnamnese] = useState<AnamneseEntry[]>([]);
  const [isAnamneseLoading, setIsAnamneseLoading] = useState<boolean>(false);
  const [isSubmittingAnamnese, setIsSubmittingAnamnese] =
    useState<boolean>(false);
  const params = useParams();

  useEffect(() => {
    const fetchAnamnese = async () => {
      if (!params.appointmentId) return;

      try {
        setIsAnamneseLoading(true);
        // Fetch anamnese data for this appointment
        const { data, error } = await supabase
          .from("anamnese_entries")
          .select("*")
          .eq("appointment_id", params.appointmentId)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setAnamnese(data);
        }
      } catch (error: any) {
        console.error("Error fetching anamnese:", error.message);
        toast.error("Erro ao carregar anamnese");
      } finally {
        setIsAnamneseLoading(false);
      }
    };

    if (params.appointmentId) {
      fetchAnamnese();
    }
  }, [params.appointmentId]);

  const addAnamneseEntry = (entry: AnamneseEntry) => {
    setAnamnese((prev) => [...prev, entry]);
  };

  const updateAnamneseEntry = (id: string, content: string) => {
    setAnamnese((prev) =>
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
      if (anamnese.length === 0) {
        toast.info("Nenhuma entrada de anamnese para salvar");
        return;
      }

      const updatePromises = anamnese.map(async (entry) => {
        if (entry.id) {
          // Update existing entry
          const { error } = await supabase
            .from("anamnese_entries")
            .update({ content: entry.content })
            .eq("id", entry.id);

          if (error) throw error;
        } else {
          // Insert new entry
          const { error } = await supabase.from("anamnese_entries").insert([
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

  return (
    <AnamneseContext.Provider
      value={{
        anamnese,
        setAnamnese,
        isAnamneseLoading,
        isSubmittingAnamnese,
        addAnamneseEntry,
        updateAnamneseEntry,
        submitAnamnese,
      }}
    >
      {children}
    </AnamneseContext.Provider>
  );
};
