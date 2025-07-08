export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      anamnese: {
        Row: {
          appointment_id: string | null
          complementary_exams: string | null
          created_at: string | null
          created_by: string
          current_illness_history: string | null
          diagnostic_hypotheses: string | null
          family_history: string | null
          id: string
          identification: string | null
          insights: Json | null
          main_complaint: string | null
          past_medical_history: string | null
          patient_id: string | null
          physical_exams: string | null
          social_history: string | null
          therapeutic_approach: string | null
          transcription_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          complementary_exams?: string | null
          created_at?: string | null
          created_by: string
          current_illness_history?: string | null
          diagnostic_hypotheses?: string | null
          family_history?: string | null
          id?: string
          identification?: string | null
          insights?: Json | null
          main_complaint?: string | null
          past_medical_history?: string | null
          patient_id?: string | null
          physical_exams?: string | null
          social_history?: string | null
          therapeutic_approach?: string | null
          transcription_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          complementary_exams?: string | null
          created_at?: string | null
          created_by?: string
          current_illness_history?: string | null
          diagnostic_hypotheses?: string | null
          family_history?: string | null
          id?: string
          identification?: string | null
          insights?: Json | null
          main_complaint?: string | null
          past_medical_history?: string | null
          patient_id?: string | null
          physical_exams?: string | null
          social_history?: string | null
          therapeutic_approach?: string | null
          transcription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anamnese_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointment"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_transcription"
            columns: ["transcription_id"]
            isOneToOne: false
            referencedRelation: "transcriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_stats: {
        Row: {
          created_at: string | null
          date: string
          id: string
          new_patients: number
          time_saved_minutes: number
          total_appointments: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          new_patients?: number
          time_saved_minutes?: number
          total_appointments?: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          new_patients?: number
          time_saved_minutes?: number
          total_appointments?: number
          user_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          created_at: string
          doctor_id: string
          id: string
          patient_id: string
          type: Database["public"]["Enums"]["appointment_type"]
        }
        Insert: {
          created_at?: string
          doctor_id: string
          id?: string
          patient_id: string
          type: Database["public"]["Enums"]["appointment_type"]
        }
        Update: {
          created_at?: string
          doctor_id?: string
          id?: string
          patient_id?: string
          type?: Database["public"]["Enums"]["appointment_type"]
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          age: number | null
          color: string | null
          created_at: string
          created_by: string
          gender: string | null
          housing: string | null
          id: string
          is_new: boolean
          marital_status:
            | Database["public"]["Enums"]["patient_marital_status"]
            | null
          name: string
          profession: string | null
          religion: string | null
          sex: Database["public"]["Enums"]["patient_sex"] | null
        }
        Insert: {
          age?: number | null
          color?: string | null
          created_at?: string
          created_by: string
          gender?: string | null
          housing?: string | null
          id?: string
          is_new?: boolean
          marital_status?:
            | Database["public"]["Enums"]["patient_marital_status"]
            | null
          name: string
          profession?: string | null
          religion?: string | null
          sex?: Database["public"]["Enums"]["patient_sex"] | null
        }
        Update: {
          age?: number | null
          color?: string | null
          created_at?: string
          created_by?: string
          gender?: string | null
          housing?: string | null
          id?: string
          is_new?: boolean
          marital_status?:
            | Database["public"]["Enums"]["patient_marital_status"]
            | null
          name?: string
          profession?: string | null
          religion?: string | null
          sex?: Database["public"]["Enums"]["patient_sex"] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth_date: string | null
          city: string | null
          created_at: string
          crm: string | null
          first_name: string | null
          has_finished_onboarding: boolean
          id: string
          last_name: string | null
          name: string
          onboarding_steps_completed: string[] | null
          plan_type: string
          specialty: string | null
          state: string | null
          trial_ends_at: string | null
        }
        Insert: {
          birth_date?: string | null
          city?: string | null
          created_at?: string
          crm?: string | null
          first_name?: string | null
          has_finished_onboarding?: boolean
          id: string
          last_name?: string | null
          name: string
          onboarding_steps_completed?: string[] | null
          plan_type?: string
          specialty?: string | null
          state?: string | null
          trial_ends_at?: string | null
        }
        Update: {
          birth_date?: string | null
          city?: string | null
          created_at?: string
          crm?: string | null
          first_name?: string | null
          has_finished_onboarding?: boolean
          id?: string
          last_name?: string | null
          name?: string
          onboarding_steps_completed?: string[] | null
          plan_type?: string
          specialty?: string | null
          state?: string | null
          trial_ends_at?: string | null
        }
        Relationships: []
      }
      transcriptions: {
        Row: {
          appointment_id: string
          created_at: string
          errors: Json | null
          id: string
          metadata: Json | null
          raw_text: string | null
          segments: Json
        }
        Insert: {
          appointment_id: string
          created_at?: string
          errors?: Json | null
          id?: string
          metadata?: Json | null
          raw_text?: string | null
          segments: Json
        }
        Update: {
          appointment_id?: string
          created_at?: string
          errors?: Json | null
          id?: string
          metadata?: Json | null
          raw_text?: string | null
          segments?: Json
        }
        Relationships: [
          {
            foreignKeyName: "transcriptions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string
          crm: string | null
          email: string
          id: string
          name: string
          specialty: string | null
        }
        Insert: {
          created_at?: string
          crm?: string | null
          email: string
          id?: string
          name: string
          specialty?: string | null
        }
        Update: {
          created_at?: string
          crm?: string | null
          email?: string
          id?: string
          name?: string
          specialty?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      appointment_type: "NEW" | "RETURN"
      patient_marital_status:
        | "SINGLE"
        | "MARRIED"
        | "DIVORCED"
        | "WIDOWED"
        | "OTHER"
      patient_sex: "MALE" | "FEMALE" | "OTHER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_type: ["NEW", "RETURN"],
      patient_marital_status: [
        "SINGLE",
        "MARRIED",
        "DIVORCED",
        "WIDOWED",
        "OTHER",
      ],
      patient_sex: ["MALE", "FEMALE", "OTHER"],
    },
  },
} as const
