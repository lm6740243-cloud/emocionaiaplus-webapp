export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          duration: number | null
          id: string
          notes: string | null
          patient_id: string
          psychologist_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          duration?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          psychologist_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          duration?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          psychologist_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          psychologist_id: string
          questions: Json
          responses: Json | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          psychologist_id: string
          questions: Json
          responses?: Json | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          psychologist_id?: string
          questions?: Json
          responses?: Json | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          created_at: string
          crisis_detected: boolean | null
          emergency_triggered: boolean | null
          id: string
          messages: Json
          session_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crisis_detected?: boolean | null
          emergency_triggered?: boolean | null
          id?: string
          messages?: Json
          session_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crisis_detected?: boolean | null
          emergency_triggered?: boolean | null
          id?: string
          messages?: Json
          session_date?: string
          user_id?: string
        }
        Relationships: []
      }
      crisis_alerts: {
        Row: {
          created_at: string
          id: string
          message: string
          patient_id: string
          psychologist_id: string | null
          severity: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          patient_id: string
          psychologist_id?: string | null
          severity: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          patient_id?: string
          psychologist_id?: string | null
          severity?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      emergency_alerts: {
        Row: {
          alert_time: string
          chat_session_id: string
          contact_notified: boolean | null
          id: string
          patient_id: string
          psychologist_notified: boolean | null
          trigger_message: string
        }
        Insert: {
          alert_time?: string
          chat_session_id: string
          contact_notified?: boolean | null
          id?: string
          patient_id: string
          psychologist_notified?: boolean | null
          trigger_message: string
        }
        Update: {
          alert_time?: string
          chat_session_id?: string
          contact_notified?: boolean | null
          id?: string
          patient_id?: string
          psychologist_notified?: boolean | null
          trigger_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_alerts_chat_session_id_fkey"
            columns: ["chat_session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      fees: {
        Row: {
          created_at: string
          currency: string | null
          id: string
          psychologist_id: string
          rate: number
          service_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          id?: string
          psychologist_id: string
          rate: number
          service_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          id?: string
          psychologist_id?: string
          rate?: number
          service_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          created_at: string
          emotions: string[]
          id: string
          mood_level: number
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emotions?: string[]
          id?: string
          mood_level: number
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emotions?: string[]
          id?: string
          mood_level?: number
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string | null
          birth_date: string | null
          clinical_history: string | null
          created_at: string
          current_conditions: string[] | null
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relation: string
          gender: string | null
          id: string
          profile_id: string
          psychologist_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          clinical_history?: string | null
          created_at?: string
          current_conditions?: string[] | null
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relation: string
          gender?: string | null
          id?: string
          profile_id: string
          psychologist_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          clinical_history?: string | null
          created_at?: string
          current_conditions?: string[] | null
          emergency_contact_name?: string
          emergency_contact_phone?: string
          emergency_contact_relation?: string
          gender?: string | null
          id?: string
          profile_id?: string
          psychologist_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      private_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          patient_id: string
          psychologist_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          patient_id: string
          psychologist_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          patient_id?: string
          psychologist_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          gender: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          gender?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
          user_type: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      support_groups: {
        Row: {
          city: string
          condition_type: string
          country: string
          created_at: string
          description: string | null
          id: string
          meeting_type: string | null
          name: string
          region: string
          whatsapp_link: string | null
        }
        Insert: {
          city: string
          condition_type: string
          country: string
          created_at?: string
          description?: string | null
          id?: string
          meeting_type?: string | null
          name: string
          region: string
          whatsapp_link?: string | null
        }
        Update: {
          city?: string
          condition_type?: string
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          meeting_type?: string | null
          name?: string
          region?: string
          whatsapp_link?: string | null
        }
        Relationships: []
      }
      wellness_tracking: {
        Row: {
          created_at: string
          date: string
          energy_level: number | null
          id: string
          mood_score: number | null
          notes: string | null
          sleep_hours: number | null
          stress_level: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          energy_level?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          energy_level?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
