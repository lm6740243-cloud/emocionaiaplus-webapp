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
      alertas_riesgo: {
        Row: {
          atendida: boolean | null
          contacto_emergencia_notificado: boolean | null
          created_at: string
          fuente: string
          grupo_id: string | null
          id: string
          mensaje_detectado: string
          mensaje_id: string | null
          nivel_severidad: string
          notas_seguimiento: string | null
          palabras_clave: string[]
          profesional_notificado: boolean | null
          timestamp: string
          updated_at: string
          user_id: string
        }
        Insert: {
          atendida?: boolean | null
          contacto_emergencia_notificado?: boolean | null
          created_at?: string
          fuente?: string
          grupo_id?: string | null
          id?: string
          mensaje_detectado: string
          mensaje_id?: string | null
          nivel_severidad?: string
          notas_seguimiento?: string | null
          palabras_clave: string[]
          profesional_notificado?: boolean | null
          timestamp?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          atendida?: boolean | null
          contacto_emergencia_notificado?: boolean | null
          created_at?: string
          fuente?: string
          grupo_id?: string | null
          id?: string
          mensaje_detectado?: string
          mensaje_id?: string | null
          nivel_severidad?: string
          notas_seguimiento?: string | null
          palabras_clave?: string[]
          profesional_notificado?: boolean | null
          timestamp?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alertas_riesgo_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alertas_riesgo_mensaje_id_fkey"
            columns: ["mensaje_id"]
            isOneToOne: false
            referencedRelation: "grupo_mensajes"
            referencedColumns: ["id"]
          },
        ]
      }
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
      calendar_events: {
        Row: {
          break_recommended: boolean | null
          break_scheduled: boolean | null
          created_at: string
          event_end: string
          event_start: string
          event_title: string
          id: string
          is_stressful: boolean | null
          stress_level: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          break_recommended?: boolean | null
          break_scheduled?: boolean | null
          created_at?: string
          event_end: string
          event_start: string
          event_title: string
          id?: string
          is_stressful?: boolean | null
          stress_level?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          break_recommended?: boolean | null
          break_scheduled?: boolean | null
          created_at?: string
          event_end?: string
          event_start?: string
          event_title?: string
          id?: string
          is_stressful?: boolean | null
          stress_level?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          role: string
          session_id: string | null
          timestamp: string
          tone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          role: string
          session_id?: string | null
          timestamp?: string
          tone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          role?: string
          session_id?: string | null
          timestamp?: string
          tone?: string | null
          user_id?: string
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
      crisis_keywords: {
        Row: {
          activo: boolean
          categoria: string
          created_at: string
          id: string
          palabra: string
          severidad: string
        }
        Insert: {
          activo?: boolean
          categoria: string
          created_at?: string
          id?: string
          palabra: string
          severidad?: string
        }
        Update: {
          activo?: boolean
          categoria?: string
          created_at?: string
          id?: string
          palabra?: string
          severidad?: string
        }
        Relationships: []
      }
      daily_challenges: {
        Row: {
          challenge_type: string
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string
          difficulty: string
          expires_at: string
          id: string
          metadata: Json | null
          points: number
          title: string
          user_id: string
        }
        Insert: {
          challenge_type: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description: string
          difficulty?: string
          expires_at: string
          id?: string
          metadata?: Json | null
          points?: number
          title: string
          user_id: string
        }
        Update: {
          challenge_type?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string
          difficulty?: string
          expires_at?: string
          id?: string
          metadata?: Json | null
          points?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      data_access_log: {
        Row: {
          accessed_at: string | null
          action: string
          id: string
          record_id: string
          table_name: string
          user_id: string
        }
        Insert: {
          accessed_at?: string | null
          action: string
          id?: string
          record_id: string
          table_name: string
          user_id: string
        }
        Update: {
          accessed_at?: string | null
          action?: string
          id?: string
          record_id?: string
          table_name?: string
          user_id?: string
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
      external_data: {
        Row: {
          created_at: string
          data_type: string
          date: string
          device_source: string | null
          id: string
          timestamp: string
          unit: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          data_type: string
          date?: string
          device_source?: string | null
          id?: string
          timestamp?: string
          unit: string
          updated_at?: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          data_type?: string
          date?: string
          device_source?: string | null
          id?: string
          timestamp?: string
          unit?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: []
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
      grupo_eventos: {
        Row: {
          creado_por: string
          created_at: string
          cupo_max: number | null
          descripcion: string | null
          duracion_min: number | null
          enlace_virtual: string | null
          fecha_hora: string
          grupo_id: string
          id: string
          modalidad: string
          titulo: string
          ubicacion_presencial: string | null
          updated_at: string
        }
        Insert: {
          creado_por: string
          created_at?: string
          cupo_max?: number | null
          descripcion?: string | null
          duracion_min?: number | null
          enlace_virtual?: string | null
          fecha_hora: string
          grupo_id: string
          id?: string
          modalidad: string
          titulo: string
          ubicacion_presencial?: string | null
          updated_at?: string
        }
        Update: {
          creado_por?: string
          created_at?: string
          cupo_max?: number | null
          descripcion?: string | null
          duracion_min?: number | null
          enlace_virtual?: string | null
          fecha_hora?: string
          grupo_id?: string
          id?: string
          modalidad?: string
          titulo?: string
          ubicacion_presencial?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupo_eventos_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      grupo_eventos_asistentes: {
        Row: {
          confirmado: boolean | null
          creado_en: string
          evento_id: string
          id: string
          user_id: string
        }
        Insert: {
          confirmado?: boolean | null
          creado_en?: string
          evento_id: string
          id?: string
          user_id: string
        }
        Update: {
          confirmado?: boolean | null
          creado_en?: string
          evento_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupo_eventos_asistentes_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "grupo_eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      grupo_mensajes: {
        Row: {
          adjunto_url: string | null
          archivo_url: string | null
          autor_id: string
          contenido: string
          creado_en: string | null
          crisis_nivel: string | null
          editado: boolean
          es_fijado: boolean | null
          es_flaggeado: boolean | null
          fecha_creacion: string
          fecha_edicion: string | null
          fijado: boolean
          grupo_id: string
          id: string
          metadata: Json | null
          reportado: boolean
          respondiendo_a: string | null
          tipo_mensaje: string
        }
        Insert: {
          adjunto_url?: string | null
          archivo_url?: string | null
          autor_id: string
          contenido: string
          creado_en?: string | null
          crisis_nivel?: string | null
          editado?: boolean
          es_fijado?: boolean | null
          es_flaggeado?: boolean | null
          fecha_creacion?: string
          fecha_edicion?: string | null
          fijado?: boolean
          grupo_id: string
          id?: string
          metadata?: Json | null
          reportado?: boolean
          respondiendo_a?: string | null
          tipo_mensaje?: string
        }
        Update: {
          adjunto_url?: string | null
          archivo_url?: string | null
          autor_id?: string
          contenido?: string
          creado_en?: string | null
          crisis_nivel?: string | null
          editado?: boolean
          es_fijado?: boolean | null
          es_flaggeado?: boolean | null
          fecha_creacion?: string
          fecha_edicion?: string | null
          fijado?: boolean
          grupo_id?: string
          id?: string
          metadata?: Json | null
          reportado?: boolean
          respondiendo_a?: string | null
          tipo_mensaje?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupo_mensajes_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grupo_mensajes_respondiendo_a_fkey"
            columns: ["respondiendo_a"]
            isOneToOne: false
            referencedRelation: "grupo_mensajes"
            referencedColumns: ["id"]
          },
        ]
      }
      grupo_miembros: {
        Row: {
          acepta_codigo_conducta: boolean | null
          activo: boolean
          alias: string
          baneado: boolean | null
          creado_en: string | null
          estado: string | null
          fecha_ban: string | null
          fecha_union: string
          grupo_id: string
          id: string
          moderado_por: string | null
          razon_ban: string | null
          rol: string
          silenciado_hasta: string | null
          user_id: string
        }
        Insert: {
          acepta_codigo_conducta?: boolean | null
          activo?: boolean
          alias: string
          baneado?: boolean | null
          creado_en?: string | null
          estado?: string | null
          fecha_ban?: string | null
          fecha_union?: string
          grupo_id: string
          id?: string
          moderado_por?: string | null
          razon_ban?: string | null
          rol?: string
          silenciado_hasta?: string | null
          user_id: string
        }
        Update: {
          acepta_codigo_conducta?: boolean | null
          activo?: boolean
          alias?: string
          baneado?: boolean | null
          creado_en?: string | null
          estado?: string | null
          fecha_ban?: string | null
          fecha_union?: string
          grupo_id?: string
          id?: string
          moderado_por?: string | null
          razon_ban?: string | null
          rol?: string
          silenciado_hasta?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupo_miembros_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      grupo_presencia: {
        Row: {
          en_linea: boolean
          grupo_id: string
          id: string
          ultima_actividad: string
          user_id: string
        }
        Insert: {
          en_linea?: boolean
          grupo_id: string
          id?: string
          ultima_actividad?: string
          user_id: string
        }
        Update: {
          en_linea?: boolean
          grupo_id?: string
          id?: string
          ultima_actividad?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupo_presencia_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      grupo_reportes: {
        Row: {
          creado_en: string | null
          descripcion: string | null
          estado: string | null
          fecha_reporte: string
          id: string
          mensaje_id: string
          motivo: string
          reportado_por: string
          resuelto: boolean
        }
        Insert: {
          creado_en?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_reporte?: string
          id?: string
          mensaje_id: string
          motivo: string
          reportado_por: string
          resuelto?: boolean
        }
        Update: {
          creado_en?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_reporte?: string
          id?: string
          mensaje_id?: string
          motivo?: string
          reportado_por?: string
          resuelto?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "grupo_reportes_mensaje_id_fkey"
            columns: ["mensaje_id"]
            isOneToOne: false
            referencedRelation: "grupo_mensajes"
            referencedColumns: ["id"]
          },
        ]
      }
      grupo_reuniones: {
        Row: {
          activo: boolean
          creado_por: string
          created_at: string
          cupo_max: number | null
          descripcion: string | null
          duracion: number
          enlace_virtual: string | null
          fecha_hora: string
          grupo_id: string
          id: string
          modalidad: string
          titulo: string
          ubicacion_presencial: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          creado_por: string
          created_at?: string
          cupo_max?: number | null
          descripcion?: string | null
          duracion?: number
          enlace_virtual?: string | null
          fecha_hora: string
          grupo_id: string
          id?: string
          modalidad: string
          titulo: string
          ubicacion_presencial?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          creado_por?: string
          created_at?: string
          cupo_max?: number | null
          descripcion?: string | null
          duracion?: number
          enlace_virtual?: string | null
          fecha_hora?: string
          grupo_id?: string
          id?: string
          modalidad?: string
          titulo?: string
          ubicacion_presencial?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupo_reuniones_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      moderador_chat_privado: {
        Row: {
          enviado_por: string
          fecha_envio: string
          grupo_id: string
          id: string
          leido: boolean
          mensaje: string
          miembro_id: string
          moderador_id: string
          tipo_mensaje: string
        }
        Insert: {
          enviado_por: string
          fecha_envio?: string
          grupo_id: string
          id?: string
          leido?: boolean
          mensaje: string
          miembro_id: string
          moderador_id: string
          tipo_mensaje?: string
        }
        Update: {
          enviado_por?: string
          fecha_envio?: string
          grupo_id?: string
          id?: string
          leido?: boolean
          mensaje?: string
          miembro_id?: string
          moderador_id?: string
          tipo_mensaje?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderador_chat_privado_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
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
      notification_preferences: {
        Row: {
          created_at: string
          email_enabled: boolean
          grupo_id: string | null
          id: string
          in_app_enabled: boolean
          tipo_notificacion: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_enabled?: boolean
          grupo_id?: string | null
          id?: string
          in_app_enabled?: boolean
          tipo_notificacion: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_enabled?: boolean
          grupo_id?: string | null
          id?: string
          in_app_enabled?: boolean
          tipo_notificacion?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          expires_at: string | null
          grupo_id: string | null
          id: string
          leida: boolean
          mensaje: string
          metadata: Json | null
          tipo: string
          titulo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          grupo_id?: string | null
          id?: string
          leida?: boolean
          mensaje: string
          metadata?: Json | null
          tipo: string
          titulo: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          grupo_id?: string | null
          id?: string
          leida?: boolean
          mensaje?: string
          metadata?: Json | null
          tipo?: string
          titulo?: string
          user_id?: string
        }
        Relationships: []
      }
      patient_resources: {
        Row: {
          assigned_at: string
          id: string
          notes: string | null
          patient_id: string
          psychologist_id: string
          resource_id: string
          status: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          psychologist_id: string
          resource_id: string
          status?: string
        }
        Update: {
          assigned_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          psychologist_id?: string
          resource_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_resources_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
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
          city: string | null
          created_at: string
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relation: string | null
          full_name: string
          gender: string | null
          id: string
          phone: string | null
          province: string | null
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          full_name: string
          gender?: string | null
          id?: string
          phone?: string | null
          province?: string | null
          updated_at?: string
          user_id: string
          user_type: string
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          phone?: string | null
          province?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      quick_chats: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          patient_id: string
          psychologist_id: string
          sender_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          patient_id: string
          psychologist_id: string
          sender_type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          patient_id?: string
          psychologist_id?: string
          sender_type?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action_type: string
          count: number | null
          id: string
          user_id: string
          window_start: string | null
        }
        Insert: {
          action_type: string
          count?: number | null
          id?: string
          user_id: string
          window_start?: string | null
        }
        Update: {
          action_type?: string
          count?: number | null
          id?: string
          user_id?: string
          window_start?: string | null
        }
        Relationships: []
      }
      recursos_emergencia: {
        Row: {
          activo: boolean
          descripcion: string | null
          disponibilidad: string
          id: string
          nombre: string
          orden: number | null
          pais: string
          telefono: string
          tipo: string
        }
        Insert: {
          activo?: boolean
          descripcion?: string | null
          disponibilidad?: string
          id?: string
          nombre: string
          orden?: number | null
          pais?: string
          telefono: string
          tipo: string
        }
        Update: {
          activo?: boolean
          descripcion?: string | null
          disponibilidad?: string
          id?: string
          nombre?: string
          orden?: number | null
          pais?: string
          telefono?: string
          tipo?: string
        }
        Relationships: []
      }
      recursos_locales: {
        Row: {
          activo: boolean
          ciudad: string
          costo: string | null
          created_at: string
          descripcion: string | null
          direccion: string | null
          email: string | null
          horarios: string | null
          id: string
          nombre: string
          poblacion_objetivo: string[] | null
          provincia: string
          servicios: string[] | null
          sitio_web: string | null
          telefono: string | null
          tipo: string
          updated_at: string
          verificado: boolean
        }
        Insert: {
          activo?: boolean
          ciudad: string
          costo?: string | null
          created_at?: string
          descripcion?: string | null
          direccion?: string | null
          email?: string | null
          horarios?: string | null
          id?: string
          nombre: string
          poblacion_objetivo?: string[] | null
          provincia: string
          servicios?: string[] | null
          sitio_web?: string | null
          telefono?: string | null
          tipo: string
          updated_at?: string
          verificado?: boolean
        }
        Update: {
          activo?: boolean
          ciudad?: string
          costo?: string | null
          created_at?: string
          descripcion?: string | null
          direccion?: string | null
          email?: string | null
          horarios?: string | null
          id?: string
          nombre?: string
          poblacion_objetivo?: string[] | null
          provincia?: string
          servicios?: string[] | null
          sitio_web?: string | null
          telefono?: string | null
          tipo?: string
          updated_at?: string
          verificado?: boolean
        }
        Relationships: []
      }
      resources: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          id: string
          psychologist_id: string
          resource_type: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          psychologist_id: string
          resource_type: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          psychologist_id?: string
          resource_type?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      reunion_asistentes: {
        Row: {
          confirmado: boolean
          fecha_inscripcion: string
          id: string
          recordatorio_enviado_1h: boolean
          recordatorio_enviado_24h: boolean
          reunion_id: string
          user_id: string
        }
        Insert: {
          confirmado?: boolean
          fecha_inscripcion?: string
          id?: string
          recordatorio_enviado_1h?: boolean
          recordatorio_enviado_24h?: boolean
          reunion_id: string
          user_id: string
        }
        Update: {
          confirmado?: boolean
          fecha_inscripcion?: string
          id?: string
          recordatorio_enviado_1h?: boolean
          recordatorio_enviado_24h?: boolean
          reunion_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reunion_asistentes_reunion_id_fkey"
            columns: ["reunion_id"]
            isOneToOne: false
            referencedRelation: "grupo_reuniones"
            referencedColumns: ["id"]
          },
        ]
      }
      reunion_recordatorios: {
        Row: {
          canal: string
          enviado_at: string
          id: string
          reunion_id: string
          tipo_recordatorio: string
          user_id: string
        }
        Insert: {
          canal?: string
          enviado_at?: string
          id?: string
          reunion_id: string
          tipo_recordatorio: string
          user_id: string
        }
        Update: {
          canal?: string
          enviado_at?: string
          id?: string
          reunion_id?: string
          tipo_recordatorio?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reunion_recordatorios_reunion_id_fkey"
            columns: ["reunion_id"]
            isOneToOne: false
            referencedRelation: "grupo_reuniones"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_redemptions: {
        Row: {
          id: string
          metadata: Json | null
          points_cost: number
          redeemed_at: string
          reward_type: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          metadata?: Json | null
          points_cost: number
          redeemed_at?: string
          reward_type: string
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          metadata?: Json | null
          points_cost?: number
          redeemed_at?: string
          reward_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      support_groups: {
        Row: {
          capacidad_max: number | null
          city: string
          configuracion_chat: Json | null
          country: string
          creado_en: string | null
          created_at: string
          current_members: number | null
          description: string | null
          id: string
          is_active: boolean | null
          meeting_type: string | null
          moderator_ids: string[] | null
          modo_lento_segundos: number | null
          name: string
          owner_id: string | null
          privacidad: string | null
          region: string
          reglas_personalizadas: string | null
          tematicas: string[] | null
          ubicacion_detalle: string | null
          whatsapp_link: string | null
        }
        Insert: {
          capacidad_max?: number | null
          city: string
          configuracion_chat?: Json | null
          country: string
          creado_en?: string | null
          created_at?: string
          current_members?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          meeting_type?: string | null
          moderator_ids?: string[] | null
          modo_lento_segundos?: number | null
          name: string
          owner_id?: string | null
          privacidad?: string | null
          region: string
          reglas_personalizadas?: string | null
          tematicas?: string[] | null
          ubicacion_detalle?: string | null
          whatsapp_link?: string | null
        }
        Update: {
          capacidad_max?: number | null
          city?: string
          configuracion_chat?: Json | null
          country?: string
          creado_en?: string | null
          created_at?: string
          current_members?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          meeting_type?: string | null
          moderator_ids?: string[] | null
          modo_lento_segundos?: number | null
          name?: string
          owner_id?: string | null
          privacidad?: string | null
          region?: string
          reglas_personalizadas?: string | null
          tematicas?: string[] | null
          ubicacion_detalle?: string | null
          whatsapp_link?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          patient_id: string
          priority: string
          psychologist_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          patient_id: string
          priority?: string
          psychologist_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          patient_id?: string
          priority?: string
          psychologist_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_key: string
          id: string
          metadata: Json | null
          progress: number | null
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_key: string
          id?: string
          metadata?: Json | null
          progress?: number | null
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_key?: string
          id?: string
          metadata?: Json | null
          progress?: number | null
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_points: {
        Row: {
          available_points: number
          created_at: string
          id: string
          level: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_points?: number
          created_at?: string
          id?: string
          level?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_points?: number
          created_at?: string
          id?: string
          level?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wellness_recommendations: {
        Row: {
          created_at: string
          description: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          recommendation_type: string
          title: string
          trigger_data: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          recommendation_type: string
          title: string
          trigger_data?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          recommendation_type?: string
          title?: string
          trigger_data?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      wellness_routes: {
        Row: {
          active: boolean
          completed_at: string | null
          completed_steps: Json
          id: string
          progress: number
          route_type: string
          started_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          completed_at?: string | null
          completed_steps?: Json
          id?: string
          progress?: number
          route_type: string
          started_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          completed_at?: string | null
          completed_steps?: Json
          id?: string
          progress?: number
          route_type?: string
          started_at?: string
          user_id?: string
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
      detect_crisis_in_message: {
        Args: {
          mensaje_contenido: string
          p_grupo_id: string
          p_mensaje_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      get_local_resources: {
        Args: { p_user_city: string; p_user_province: string }
        Returns: {
          costo: string
          descripcion: string
          direccion: string
          distance_score: number
          email: string
          horarios: string
          id: string
          is_local: boolean
          nombre: string
          poblacion_objetivo: string[]
          servicios: string[]
          sitio_web: string
          telefono: string
          tipo: string
        }[]
      }
      get_meeting_with_attendance: {
        Args: { p_meeting_id: string; p_user_id: string }
        Returns: {
          creado_por: string
          cupo_max: number
          descripcion: string
          duracion: number
          enlace_virtual: string
          fecha_hora: string
          grupo_id: string
          id: string
          modalidad: string
          spaces_available: number
          titulo: string
          total_asistentes: number
          ubicacion_presencial: string
          user_registered: boolean
        }[]
      }
      get_nearby_groups: {
        Args: { p_user_city: string; p_user_province: string }
        Returns: {
          capacidad_max: number
          city: string
          country: string
          created_at: string
          current_members: number
          description: string
          distance_score: number
          id: string
          is_local: boolean
          meeting_type: string
          name: string
          region: string
        }[]
      }
      has_role: {
        Args: {
          p_role: Database["public"]["Enums"]["app_role"]
          p_user_id: string
        }
        Returns: boolean
      }
      moderate_member: {
        Args: {
          p_action: string
          p_duration_hours?: number
          p_grupo_id: string
          p_reason?: string
          p_target_user_id: string
        }
        Returns: boolean
      }
      send_meeting_reminders: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_presence: {
        Args: { p_en_linea?: boolean; p_grupo_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "psychologist" | "patient" | "support"
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
      app_role: ["admin", "moderator", "psychologist", "patient", "support"],
    },
  },
} as const
