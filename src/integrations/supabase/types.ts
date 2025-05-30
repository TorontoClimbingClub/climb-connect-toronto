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
      archived_event_attendance: {
        Row: {
          archived_at: string
          attended_at: string
          created_at: string
          event_date: string
          event_id: string
          event_title: string
          id: string
          user_id: string
        }
        Insert: {
          archived_at?: string
          attended_at: string
          created_at?: string
          event_date: string
          event_id: string
          event_title: string
          id?: string
          user_id: string
        }
        Update: {
          archived_at?: string
          attended_at?: string
          created_at?: string
          event_date?: string
          event_id?: string
          event_title?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      climb_completions: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          route_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          route_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          route_id?: string
          user_id?: string
        }
        Relationships: []
      }
      climbing_styles_ref: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
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
      event_attendance_approvals: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          event_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          event_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          event_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_approvals_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendance_approvals_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      event_comments: {
        Row: {
          comment: string
          created_at: string
          event_id: string
          id: string
          parent_id: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          comment: string
          created_at?: string
          event_id: string
          id?: string
          parent_id?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          comment?: string
          created_at?: string
          event_id?: string
          id?: string
          parent_id?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_comments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_comments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "event_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          assigned_driver_id: string | null
          available_seats: number | null
          carpool_driver_notes: string | null
          event_id: string
          id: string
          is_carpool_driver: boolean | null
          joined_at: string | null
          needs_carpool: boolean | null
          user_id: string
        }
        Insert: {
          assigned_driver_id?: string | null
          available_seats?: number | null
          carpool_driver_notes?: string | null
          event_id: string
          id?: string
          is_carpool_driver?: boolean | null
          joined_at?: string | null
          needs_carpool?: boolean | null
          user_id: string
        }
        Update: {
          assigned_driver_id?: string | null
          available_seats?: number | null
          carpool_driver_notes?: string | null
          event_id?: string
          id?: string
          is_carpool_driver?: boolean | null
          joined_at?: string | null
          needs_carpool?: boolean | null
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
          details: string | null
          difficulty_level: string | null
          end_time: string | null
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
          details?: string | null
          difficulty_level?: string | null
          end_time?: string | null
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
          details?: string | null
          difficulty_level?: string | null
          end_time?: string | null
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
          allow_profile_viewing: boolean | null
          bio: string | null
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
          profile_photo_url: string | null
          show_climbing_level: boolean | null
          show_climbing_progress: boolean | null
          show_completion_stats: boolean | null
          show_sport_progress: boolean | null
          show_top_rope_progress: boolean | null
          show_trad_progress: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_profile_viewing?: boolean | null
          bio?: string | null
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
          profile_photo_url?: string | null
          show_climbing_level?: boolean | null
          show_climbing_progress?: boolean | null
          show_completion_stats?: boolean | null
          show_sport_progress?: boolean | null
          show_top_rope_progress?: boolean | null
          show_trad_progress?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_profile_viewing?: boolean | null
          bio?: string | null
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
          profile_photo_url?: string | null
          show_climbing_level?: boolean | null
          show_climbing_progress?: boolean | null
          show_completion_stats?: boolean | null
          show_sport_progress?: boolean | null
          show_top_rope_progress?: boolean | null
          show_trad_progress?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      route_beta_grades: {
        Row: {
          beta_grade: string
          grade_distribution: Json
          last_updated: string
          route_id: string
          submission_count: number
        }
        Insert: {
          beta_grade: string
          grade_distribution?: Json
          last_updated?: string
          route_id: string
          submission_count?: number
        }
        Update: {
          beta_grade?: string
          grade_distribution?: Json
          last_updated?: string
          route_id?: string
          submission_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "route_beta_grades_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: true
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      route_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          parent_id: string | null
          route_id: string
          user_id: string
          user_name: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          parent_id?: string | null
          route_id: string
          user_id: string
          user_name: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          route_id?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "route_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      route_grade_submissions: {
        Row: {
          climbing_style: string
          created_at: string
          id: string
          notes: string | null
          route_id: string
          submitted_grade: string
          updated_at: string
          user_id: string
        }
        Insert: {
          climbing_style: string
          created_at?: string
          id?: string
          notes?: string | null
          route_id: string
          submitted_grade: string
          updated_at?: string
          user_id: string
        }
        Update: {
          climbing_style?: string
          created_at?: string
          id?: string
          notes?: string | null
          route_id?: string
          submitted_grade?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_grade_submissions_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "route_photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          area: string
          created_at: string
          grade: string
          id: string
          name: string
          sector: string
          style: string
          updated_at: string
        }
        Insert: {
          area: string
          created_at?: string
          grade: string
          id: string
          name: string
          sector: string
          style: string
          updated_at?: string
        }
        Update: {
          area?: string
          created_at?: string
          grade?: string
          id?: string
          name?: string
          sector?: string
          style?: string
          updated_at?: string
        }
        Relationships: []
      }
      session_climbs: {
        Row: {
          attempts_made: number
          climbing_style: string
          completed: boolean
          created_at: string
          falls_count: number
          id: string
          is_hardest_climb: boolean
          notes: string | null
          rest_time_minutes: number | null
          route_grade: string
          session_id: string
        }
        Insert: {
          attempts_made?: number
          climbing_style: string
          completed?: boolean
          created_at?: string
          falls_count?: number
          id?: string
          is_hardest_climb?: boolean
          notes?: string | null
          rest_time_minutes?: number | null
          route_grade: string
          session_id: string
        }
        Update: {
          attempts_made?: number
          climbing_style?: string
          completed?: boolean
          created_at?: string
          falls_count?: number
          id?: string
          is_hardest_climb?: boolean
          notes?: string | null
          rest_time_minutes?: number | null
          route_grade?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_climbs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_gear: {
        Row: {
          created_at: string
          gear_name: string
          gear_type: string | null
          id: string
          notes: string | null
          session_id: string
        }
        Insert: {
          created_at?: string
          gear_name: string
          gear_type?: string | null
          id?: string
          notes?: string | null
          session_id: string
        }
        Update: {
          created_at?: string
          gear_name?: string
          gear_type?: string | null
          id?: string
          notes?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_gear_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_goals_ref: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      session_techniques: {
        Row: {
          created_at: string
          description: string | null
          id: string
          session_id: string
          success_level: string | null
          technique_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          session_id: string
          success_level?: string | null
          technique_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          session_id?: string
          success_level?: string | null
          technique_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_techniques_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_climbs: {
        Row: {
          created_at: string | null
          duration_minutes: number
          grade: string
          id: string
          number_of_takes: number | null
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_minutes: number
          grade: string
          id?: string
          number_of_takes?: number | null
          session_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number
          grade?: string
          id?: string
          number_of_takes?: number | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainer_climbs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "trainer_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_sessions: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: string
          max_hang_time: number | null
          max_lockoff: number | null
          max_pull_ups: number | null
          recovery_feeling: number | null
          rest_days_before_session: number | null
          sii: number | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          max_hang_time?: number | null
          max_lockoff?: number | null
          max_pull_ups?: number | null
          recovery_feeling?: number | null
          rest_days_before_session?: number | null
          sii?: number | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          max_hang_time?: number | null
          max_lockoff?: number | null
          max_pull_ups?: number | null
          recovery_feeling?: number | null
          rest_days_before_session?: number | null
          sii?: number | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      training_sessions: {
        Row: {
          created_at: string
          custom_goal: string | null
          end_time: string | null
          felt_after_session: string | null
          felt_tired_at_end: boolean
          gear_used: boolean
          id: string
          max_grade_climbed: string | null
          new_techniques_tried: boolean
          partner_count: number
          session_date: string
          session_goal: string | null
          start_time: string
          total_climbs: number
          updated_at: string
          user_id: string
          warm_up_done: boolean
          would_change_next_time: string | null
        }
        Insert: {
          created_at?: string
          custom_goal?: string | null
          end_time?: string | null
          felt_after_session?: string | null
          felt_tired_at_end?: boolean
          gear_used?: boolean
          id?: string
          max_grade_climbed?: string | null
          new_techniques_tried?: boolean
          partner_count?: number
          session_date?: string
          session_goal?: string | null
          start_time?: string
          total_climbs?: number
          updated_at?: string
          user_id: string
          warm_up_done?: boolean
          would_change_next_time?: string | null
        }
        Update: {
          created_at?: string
          custom_goal?: string | null
          end_time?: string | null
          felt_after_session?: string | null
          felt_tired_at_end?: boolean
          gear_used?: boolean
          id?: string
          max_grade_climbed?: string | null
          new_techniques_tried?: boolean
          partner_count?: number
          session_date?: string
          session_goal?: string | null
          start_time?: string
          total_climbs?: number
          updated_at?: string
          user_id?: string
          warm_up_done?: boolean
          would_change_next_time?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
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
      calculate_beta_grade: {
        Args: { route_id_param: string }
        Returns: undefined
      }
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
