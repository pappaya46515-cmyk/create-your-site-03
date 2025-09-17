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
      agreements: {
        Row: {
          agreement_date: string | null
          buyer_address: string
          buyer_contact: string
          buyer_father_name: string | null
          buyer_name: string
          created_at: string | null
          created_by: string
          id: string
          insurance_number: string | null
          jersey_number: string | null
          pdf_url: string | null
          rc_number: string | null
          seller_aadhaar: string | null
          seller_address: string
          seller_contact: string
          seller_father_name: string | null
          seller_name: string
          seller_pincode: string | null
          serial_number: string | null
          vehicle_id: string
          vehicle_number: string | null
          witness_signature: string | null
        }
        Insert: {
          agreement_date?: string | null
          buyer_address: string
          buyer_contact: string
          buyer_father_name?: string | null
          buyer_name: string
          created_at?: string | null
          created_by: string
          id?: string
          insurance_number?: string | null
          jersey_number?: string | null
          pdf_url?: string | null
          rc_number?: string | null
          seller_aadhaar?: string | null
          seller_address: string
          seller_contact: string
          seller_father_name?: string | null
          seller_name: string
          seller_pincode?: string | null
          serial_number?: string | null
          vehicle_id: string
          vehicle_number?: string | null
          witness_signature?: string | null
        }
        Update: {
          agreement_date?: string | null
          buyer_address?: string
          buyer_contact?: string
          buyer_father_name?: string | null
          buyer_name?: string
          created_at?: string | null
          created_by?: string
          id?: string
          insurance_number?: string | null
          jersey_number?: string | null
          pdf_url?: string | null
          rc_number?: string | null
          seller_aadhaar?: string | null
          seller_address?: string
          seller_contact?: string
          seller_father_name?: string | null
          seller_name?: string
          seller_pincode?: string | null
          serial_number?: string | null
          vehicle_id?: string
          vehicle_number?: string | null
          witness_signature?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agreements_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      buyer_interests: {
        Row: {
          buyer_id: string
          contacted: boolean | null
          created_at: string | null
          id: string
          search_query: string | null
          vehicle_id: string
        }
        Insert: {
          buyer_id: string
          contacted?: boolean | null
          created_at?: string | null
          id?: string
          search_query?: string | null
          vehicle_id: string
        }
        Update: {
          buyer_id?: string
          contacted?: boolean | null
          created_at?: string | null
          id?: string
          search_query?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "buyer_interests_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          type: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          type: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          type?: string
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_analytics: {
        Row: {
          category: Database["public"]["Enums"]["vehicle_category"] | null
          created_at: string | null
          id: string
          max_price: number | null
          min_price: number | null
          results_count: number | null
          search_term: string
          user_id: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["vehicle_category"] | null
          created_at?: string | null
          id?: string
          max_price?: number | null
          min_price?: number | null
          results_count?: number | null
          search_term: string
          user_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["vehicle_category"] | null
          created_at?: string | null
          id?: string
          max_price?: number | null
          min_price?: number | null
          results_count?: number | null
          search_term?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_documents: {
        Row: {
          created_at: string | null
          document_type: string
          file_url: string
          id: string
          uploaded_by: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          document_type: string
          file_url: string
          id?: string
          uploaded_by: string
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          document_type?: string
          file_url?: string
          id?: string
          uploaded_by?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          buyer_id: string | null
          category: Database["public"]["Enums"]["vehicle_category"]
          created_at: string | null
          deal_value: number
          engine_number: string | null
          has_duplicate_rc: boolean | null
          has_form_29: boolean | null
          has_form_30: boolean | null
          has_insurance: boolean | null
          has_noc: boolean | null
          has_original_rc: boolean | null
          id: string
          model_name: string
          model_year: number | null
          ownership_type: Database["public"]["Enums"]["ownership_type"]
          rc_owner_address: string | null
          rc_owner_contact: string | null
          rc_owner_name: string | null
          registration_number: string | null
          seller_id: string
          slab_amount: number | null
          sold_date: string | null
          status: Database["public"]["Enums"]["stock_status"] | null
          updated_at: string | null
        }
        Insert: {
          buyer_id?: string | null
          category: Database["public"]["Enums"]["vehicle_category"]
          created_at?: string | null
          deal_value: number
          engine_number?: string | null
          has_duplicate_rc?: boolean | null
          has_form_29?: boolean | null
          has_form_30?: boolean | null
          has_insurance?: boolean | null
          has_noc?: boolean | null
          has_original_rc?: boolean | null
          id?: string
          model_name: string
          model_year?: number | null
          ownership_type: Database["public"]["Enums"]["ownership_type"]
          rc_owner_address?: string | null
          rc_owner_contact?: string | null
          rc_owner_name?: string | null
          registration_number?: string | null
          seller_id: string
          slab_amount?: number | null
          sold_date?: string | null
          status?: Database["public"]["Enums"]["stock_status"] | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string | null
          category?: Database["public"]["Enums"]["vehicle_category"]
          created_at?: string | null
          deal_value?: number
          engine_number?: string | null
          has_duplicate_rc?: boolean | null
          has_form_29?: boolean | null
          has_form_30?: boolean | null
          has_insurance?: boolean | null
          has_noc?: boolean | null
          has_original_rc?: boolean | null
          id?: string
          model_name?: string
          model_year?: number | null
          ownership_type?: Database["public"]["Enums"]["ownership_type"]
          rc_owner_address?: string | null
          rc_owner_contact?: string | null
          rc_owner_name?: string | null
          registration_number?: string | null
          seller_id?: string
          slab_amount?: number | null
          sold_date?: string | null
          status?: Database["public"]["Enums"]["stock_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bootstrap_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "seller" | "buyer"
      ownership_type: "kamtha" | "third_party"
      stock_status: "available" | "pending" | "sold" | "archived"
      vehicle_category: "tractor" | "other_vehicle"
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
      app_role: ["admin", "seller", "buyer"],
      ownership_type: ["kamtha", "third_party"],
      stock_status: ["available", "pending", "sold", "archived"],
      vehicle_category: ["tractor", "other_vehicle"],
    },
  },
} as const
