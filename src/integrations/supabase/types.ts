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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string
          date: string
          id: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string
        }
        Relationships: []
      }
      balance_sheet: {
        Row: {
          amount: number | null
          category: string
          created_at: string
          created_by: string | null
          id: string
          item_name: string
          notes: string | null
          period: string
          sub_category: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          category: string
          created_at?: string
          created_by?: string | null
          id?: string
          item_name: string
          notes?: string | null
          period: string
          sub_category?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          item_name?: string
          notes?: string | null
          period?: string
          sub_category?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          brand_name: string
          client_id: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          package: string | null
          pic_name: string | null
          service_category: string | null
          start_date: string | null
          status: string
          updated_at: string
          value_idr: number | null
        }
        Insert: {
          brand_name: string
          client_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          package?: string | null
          pic_name?: string | null
          service_category?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          value_idr?: number | null
        }
        Update: {
          brand_name?: string
          client_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          package?: string | null
          pic_name?: string | null
          service_category?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          value_idr?: number | null
        }
        Relationships: []
      }
      finance_transactions: {
        Row: {
          category: string
          client_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          expense: number | null
          id: string
          income: number | null
          project_id: string | null
          transaction_date: string
          transaction_no: string
          updated_at: string
        }
        Insert: {
          category: string
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense?: number | null
          id?: string
          income?: number | null
          project_id?: string | null
          transaction_date?: string
          transaction_no: string
          updated_at?: string
        }
        Update: {
          category?: string
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense?: number | null
          id?: string
          income?: number | null
          project_id?: string | null
          transaction_date?: string
          transaction_no?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          employee_id: string | null
          full_name: string
          id: string
          join_date: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          employee_id?: string | null
          full_name?: string
          id?: string
          join_date?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          employee_id?: string | null
          full_name?: string
          id?: string
          join_date?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_id: string | null
          created_at: string
          created_by: string | null
          editor: string | null
          end_date: string | null
          id: string
          name: string
          notes: string | null
          package: string | null
          progress: number | null
          project_id: string
          project_lead: string | null
          service_category: string | null
          service_type: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          editor?: string | null
          end_date?: string | null
          id?: string
          name: string
          notes?: string | null
          package?: string | null
          progress?: number | null
          project_id: string
          project_lead?: string | null
          service_category?: string | null
          service_type?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          editor?: string | null
          end_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          package?: string | null
          progress?: number | null
          project_id?: string
          project_lead?: string | null
          service_category?: string | null
          service_type?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          features: Json | null
          hpp: number | null
          id: string
          name: string
          price: number | null
          status: string
          tier: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          features?: Json | null
          hpp?: number | null
          id?: string
          name: string
          price?: number | null
          status?: string
          tier?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          features?: Json | null
          hpp?: number | null
          id?: string
          name?: string
          price?: number | null
          status?: string
          tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          approval_status: string
          asset_url: string | null
          assigned_copywriter: string | null
          assigned_editor: string | null
          assigned_pl: string | null
          assigned_videographer: string | null
          brief: string | null
          caption: string | null
          created_at: string
          created_by: string | null
          description: string | null
          done_date: string | null
          due_date: string | null
          emotional_angle: string | null
          id: string
          medium: string | null
          pillar: string | null
          poem: string | null
          project_id: string
          reference_url: string | null
          script: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          approval_status?: string
          asset_url?: string | null
          assigned_copywriter?: string | null
          assigned_editor?: string | null
          assigned_pl?: string | null
          assigned_videographer?: string | null
          brief?: string | null
          caption?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          done_date?: string | null
          due_date?: string | null
          emotional_angle?: string | null
          id?: string
          medium?: string | null
          pillar?: string | null
          poem?: string | null
          project_id: string
          reference_url?: string | null
          script?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          approval_status?: string
          asset_url?: string | null
          assigned_copywriter?: string | null
          assigned_editor?: string | null
          assigned_pl?: string | null
          assigned_videographer?: string | null
          brief?: string | null
          caption?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          done_date?: string | null
          due_date?: string | null
          emotional_angle?: string | null
          id?: string
          medium?: string | null
          pillar?: string | null
          poem?: string | null
          project_id?: string
          reference_url?: string | null
          script?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
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
      app_role: "super_admin" | "admin" | "employee"
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
      app_role: ["super_admin", "admin", "employee"],
    },
  },
} as const
