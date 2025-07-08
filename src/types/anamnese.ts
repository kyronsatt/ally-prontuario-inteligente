
import { Json } from "@/integrations/supabase/types";

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
  created_at?: string | Date;
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

export interface AnamneseEntry {
  id?: string;
  title: string;
  content: string;
  type: string;
  created_at?: string;
  appointment_id?: string;
}

export interface AnamneseDBEntry {
  id?: string;
  appointment_id?: string;
  title?: string;
  content?: string;
  type?: string;
  created_at?: string;
  created_by?: string;
}
