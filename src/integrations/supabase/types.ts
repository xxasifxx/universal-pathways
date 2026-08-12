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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          notified_at: string | null
          notify_status: string | null
          role: string
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          notified_at?: string | null
          notify_status?: string | null
          role: string
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          notified_at?: string | null
          notify_status?: string | null
          role?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      contributions: {
        Row: {
          address_line1: string
          amount_cents: number
          certifies_own_funds: boolean
          certifies_us_person: boolean
          city: string
          created_at: string
          email: string
          employer: string
          id: string
          method: string
          name: string
          note: string | null
          occupation: string
          phone: string | null
          state: string
          status: string
          visitor_id: string | null
          zip_code: string
        }
        Insert: {
          address_line1: string
          amount_cents: number
          certifies_own_funds?: boolean
          certifies_us_person?: boolean
          city: string
          created_at?: string
          email: string
          employer: string
          id?: string
          method: string
          name: string
          note?: string | null
          occupation: string
          phone?: string | null
          state: string
          status?: string
          visitor_id?: string | null
          zip_code: string
        }
        Update: {
          address_line1?: string
          amount_cents?: number
          certifies_own_funds?: boolean
          certifies_us_person?: boolean
          city?: string
          created_at?: string
          email?: string
          employer?: string
          id?: string
          method?: string
          name?: string
          note?: string | null
          occupation?: string
          phone?: string | null
          state?: string
          status?: string
          visitor_id?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "contributions_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          avg_turnout_pct: number
          city: string | null
          created_at: string
          district: number | null
          geocode_error: string | null
          geocode_status: string
          hh_key: string
          id: string
          lat: number | null
          lng: number | null
          matched_count: number
          street_name: string | null
          street_num: string | null
          updated_at: string
          voter_count: number
          zip: string | null
        }
        Insert: {
          avg_turnout_pct?: number
          city?: string | null
          created_at?: string
          district?: number | null
          geocode_error?: string | null
          geocode_status?: string
          hh_key: string
          id?: string
          lat?: number | null
          lng?: number | null
          matched_count?: number
          street_name?: string | null
          street_num?: string | null
          updated_at?: string
          voter_count?: number
          zip?: string | null
        }
        Update: {
          avg_turnout_pct?: number
          city?: string | null
          created_at?: string
          district?: number | null
          geocode_error?: string | null
          geocode_status?: string
          hh_key?: string
          id?: string
          lat?: number | null
          lng?: number | null
          matched_count?: number
          street_name?: string | null
          street_num?: string | null
          updated_at?: string
          voter_count?: number
          zip?: string | null
        }
        Relationships: []
      }
      lead_signals: {
        Row: {
          anon_id: string | null
          created_at: string
          dwell_ms: number | null
          event: string
          fp_hash: string | null
          id: string
          ip: string | null
          meta: Json | null
          path: string | null
          referrer: string | null
          service_group: string | null
          service_slug: string | null
          session_id: string | null
          user_agent: string | null
          utm: Json | null
          visitor_id: string | null
        }
        Insert: {
          anon_id?: string | null
          created_at?: string
          dwell_ms?: number | null
          event: string
          fp_hash?: string | null
          id?: string
          ip?: string | null
          meta?: Json | null
          path?: string | null
          referrer?: string | null
          service_group?: string | null
          service_slug?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm?: Json | null
          visitor_id?: string | null
        }
        Update: {
          anon_id?: string | null
          created_at?: string
          dwell_ms?: number | null
          event?: string
          fp_hash?: string | null
          id?: string
          ip?: string | null
          meta?: Json | null
          path?: string | null
          referrer?: string | null
          service_group?: string | null
          service_slug?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm?: Json | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_signals_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      petition_signers: {
        Row: {
          address: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          signed: boolean
          town: string | null
          verified: boolean
        }
        Insert: {
          address?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          signed?: boolean
          town?: string | null
          verified?: boolean
        }
        Update: {
          address?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          signed?: boolean
          town?: string | null
          verified?: boolean
        }
        Relationships: []
      }
      pointer_samples: {
        Row: {
          created_at: string
          id: string
          is_touch: boolean
          path: string | null
          sample_count: number
          samples: Json
          session_id: string | null
          viewport_h: number | null
          viewport_w: number | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_touch?: boolean
          path?: string | null
          sample_count?: number
          samples: Json
          session_id?: string | null
          viewport_h?: number | null
          viewport_w?: number | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_touch?: boolean
          path?: string | null
          sample_count?: number
          samples?: Json
          session_id?: string | null
          viewport_h?: number | null
          viewport_w?: number | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pointer_samples_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      replay_events: {
        Row: {
          created_at: string
          events: Json
          id: string
          path: string | null
          seq: number
          session_id: string
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          events: Json
          id?: string
          path?: string | null
          seq: number
          session_id: string
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          events?: Json
          id?: string
          path?: string | null
          seq?: number
          session_id?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "replay_events_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      turnout_history: {
        Row: {
          turnout_pct: number
          voted: number
          year: number
        }
        Insert: {
          turnout_pct?: number
          voted?: number
          year: number
        }
        Update: {
          turnout_pct?: number
          voted?: number
          year?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_aliases: {
        Row: {
          anon_id: string | null
          created_at: string
          fp_hash: string | null
          id: string
          visitor_id: string
        }
        Insert: {
          anon_id?: string | null
          created_at?: string
          fp_hash?: string | null
          id?: string
          visitor_id: string
        }
        Update: {
          anon_id?: string | null
          created_at?: string
          fp_hash?: string | null
          id?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitor_aliases_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      visitors: {
        Row: {
          anon_id: string | null
          created_at: string
          email: string | null
          first_ip: string | null
          first_seen: string
          first_ua: string | null
          fp_hash: string | null
          id: string
          identified_at: string | null
          is_staff: boolean
          label: string | null
          last_ip: string | null
          last_seen: string
          last_ua: string | null
          merged_into: string | null
          name: string | null
          notes: string | null
          phone: string | null
          signal_count: number
          updated_at: string
        }
        Insert: {
          anon_id?: string | null
          created_at?: string
          email?: string | null
          first_ip?: string | null
          first_seen?: string
          first_ua?: string | null
          fp_hash?: string | null
          id?: string
          identified_at?: string | null
          is_staff?: boolean
          label?: string | null
          last_ip?: string | null
          last_seen?: string
          last_ua?: string | null
          merged_into?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          signal_count?: number
          updated_at?: string
        }
        Update: {
          anon_id?: string | null
          created_at?: string
          email?: string | null
          first_ip?: string | null
          first_seen?: string
          first_ua?: string | null
          fp_hash?: string | null
          id?: string
          identified_at?: string | null
          is_staff?: boolean
          label?: string | null
          last_ip?: string | null
          last_seen?: string
          last_ua?: string | null
          merged_into?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          signal_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitors_merged_into_fkey"
            columns: ["merged_into"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_signups: {
        Row: {
          created_at: string
          email: string
          help_details: Json
          help_with: string[]
          id: string
          mobile: string | null
          name: string
          notified_at: string | null
          notify_status: string | null
          visitor_id: string | null
          zip_code: string
          zone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          help_details?: Json
          help_with?: string[]
          id?: string
          mobile?: string | null
          name: string
          notified_at?: string | null
          notify_status?: string | null
          visitor_id?: string | null
          zip_code: string
          zone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          help_details?: Json
          help_with?: string[]
          id?: string
          mobile?: string | null
          name?: string
          notified_at?: string | null
          notify_status?: string | null
          visitor_id?: string | null
          zip_code?: string
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_signups_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      voters: {
        Row: {
          apt_unit: string | null
          city: string | null
          contact_name: string | null
          created_at: string
          display_id: string
          district: number | null
          first_name: string | null
          hh_key: string | null
          household_size: number
          id: string
          impact_score: number | null
          is_matched: boolean
          is_personal_contact: boolean
          is_petition_signer: boolean
          last_name: string | null
          leg_id: string | null
          middle_name: string | null
          party: string | null
          phone: string | null
          reg_date: string | null
          status: string | null
          street_name: string | null
          street_num: string | null
          turnout_pct: number
          voted_2018: boolean
          voted_2019: boolean
          voted_2020: boolean
          voted_2021: boolean
          voted_2022: boolean
          voted_2023: boolean
          voted_2024: boolean
          voted_2025: boolean
          ward: string | null
          zip: string | null
        }
        Insert: {
          apt_unit?: string | null
          city?: string | null
          contact_name?: string | null
          created_at?: string
          display_id: string
          district?: number | null
          first_name?: string | null
          hh_key?: string | null
          household_size?: number
          id?: string
          impact_score?: number | null
          is_matched?: boolean
          is_personal_contact?: boolean
          is_petition_signer?: boolean
          last_name?: string | null
          leg_id?: string | null
          middle_name?: string | null
          party?: string | null
          phone?: string | null
          reg_date?: string | null
          status?: string | null
          street_name?: string | null
          street_num?: string | null
          turnout_pct?: number
          voted_2018?: boolean
          voted_2019?: boolean
          voted_2020?: boolean
          voted_2021?: boolean
          voted_2022?: boolean
          voted_2023?: boolean
          voted_2024?: boolean
          voted_2025?: boolean
          ward?: string | null
          zip?: string | null
        }
        Update: {
          apt_unit?: string | null
          city?: string | null
          contact_name?: string | null
          created_at?: string
          display_id?: string
          district?: number | null
          first_name?: string | null
          hh_key?: string | null
          household_size?: number
          id?: string
          impact_score?: number | null
          is_matched?: boolean
          is_personal_contact?: boolean
          is_petition_signer?: boolean
          last_name?: string | null
          leg_id?: string | null
          middle_name?: string | null
          party?: string | null
          phone?: string | null
          reg_date?: string | null
          status?: string | null
          street_name?: string | null
          street_num?: string | null
          turnout_pct?: number
          voted_2018?: boolean
          voted_2019?: boolean
          voted_2020?: boolean
          voted_2021?: boolean
          voted_2022?: boolean
          voted_2023?: boolean
          voted_2024?: boolean
          voted_2025?: boolean
          ward?: string | null
          zip?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      purge_tracking_data: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin"
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
      app_role: ["admin"],
    },
  },
} as const
