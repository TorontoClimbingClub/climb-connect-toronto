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
      equipment_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      event_equipment: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          user_equipment_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          user_equipment_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          user_equipment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_equipment_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_equipment_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_equipment_user_equipment_id_fkey"
            columns: ["user_equipment_id"]
            isOneToOne: false
            referencedRelation: "user_equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          available_seats: number | null
          event_id: string
          id: string
          is_carpool_driver: boolean | null
          joined_at: string | null
          user_id: string
        }
        Insert: {
          available_seats?: number | null
          event_id: string
          id?: string
          is_carpool_driver?: boolean | null
          joined_at?: string | null
          user_id: string
        }
        Update: {
          available_seats?: number | null
          event_id?: string
          id?: string
          is_carpool_driver?: boolean | null
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_event_participants_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity_limit: number | null
          created_at: string | null
          date: string
          description: string | null
          difficulty_level: string | null
          id: string
          location: string
          max_participants: number | null
          organizer_id: string
          required_climbing_experience: string[] | null
          required_climbing_level: string | null
          time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          capacity_limit?: number | null
          created_at?: string | null
          date: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          location: string
          max_participants?: number | null
          organizer_id: string
          required_climbing_experience?: string[] | null
          required_climbing_level?: string | null
          time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          capacity_limit?: number | null
          created_at?: string | null
          date?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          location?: string
          max_participants?: number | null
          organizer_id?: string
          required_climbing_experience?: string[] | null
          required_climbing_level?: string | null
          time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          climbing_description: string | null
          climbing_experience: string[] | null
          climbing_level: string | null
          created_at: string | null
          full_name: string
          id: string
          is_carpool_driver: boolean | null
          passenger_capacity: number | null
          personal_message: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          climbing_description?: string | null
          climbing_experience?: string[] | null
          climbing_level?: string | null
          created_at?: string | null
          full_name: string
          id: string
          is_carpool_driver?: boolean | null
          passenger_capacity?: number | null
          personal_message?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          climbing_description?: string | null
          climbing_experience?: string[] | null
          climbing_level?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          is_carpool_driver?: boolean | null
          passenger_capacity?: number | null
          personal_message?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      route_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          route_id: string
          user_id: string
          user_name: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          route_id: string
          user_id: string
          user_name: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          route_id?: string
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      route_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          photo_url: string
          route_id: string
          user_id: string
          user_name: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_url: string
          route_id: string
          user_id: string
          user_name: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_url?: string
          route_id?: string
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      user_equipment: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          item_name: string
          notes: string | null
          quantity: number
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          item_name: string
          notes?: string | null
          quantity?: number
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          item_name?: string
          notes?: string | null
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_equipment_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "equipment_categories"
            referencedColumns: ["id"]
          },
        ]
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
          role?: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      events_with_participants: {
        Row: {
          created_at: string | null
          date: string | null
          description: string | null
          difficulty_level: string | null
          id: string | null
          location: string | null
          max_participants: number | null
          organizer_id: string | null
          participants_count: number | null
          time: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_user_account: {
        Args: { user_id: string }
        Returns: undefined
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "member" | "organizer" | "admin"
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
      app_role: ["member", "organizer", "admin"],
    },
  },
} as const
