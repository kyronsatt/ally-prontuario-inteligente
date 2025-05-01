export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          created_at: string
          created_by: string
          gender: Database["public"]["Enums"]["patient_gender"] | null
          id: string
          is_new: boolean
          name: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          created_by: string
          gender?: Database["public"]["Enums"]["patient_gender"] | null
          id?: string
          is_new?: boolean
          name: string
        }
        Update: {
          age?: number | null
          created_at?: string
          created_by?: string
          gender?: Database["public"]["Enums"]["patient_gender"] | null
          id?: string
          is_new?: boolean
          name?: string
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
          id: string
          last_name: string | null
          name: string
          specialty: string | null
          state: string | null
        }
        Insert: {
          birth_date?: string | null
          city?: string | null
          created_at?: string
          crm?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          name: string
          specialty?: string | null
          state?: string | null
        }
        Update: {
          birth_date?: string | null
          city?: string | null
          created_at?: string
          crm?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          name?: string
          specialty?: string | null
          state?: string | null
        }
        Relationships: []
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
      patient_gender: "MALE" | "FEMALE" | "OTHER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_type: ["NEW", "RETURN"],
      patient_gender: ["MALE", "FEMALE", "OTHER"],
    },
  },
} as const
