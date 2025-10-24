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
      activities: {
        Row: {
          activity_type: string
          age_range: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: string | null
          id: string
          is_published: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          activity_type: string
          age_range?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_published?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          activity_type?: string
          age_range?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_published?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      activity_items: {
        Row: {
          activity_id: string
          content: Json
          correct_answer: string | null
          created_at: string
          id: string
          item_type: string
          order_index: number
        }
        Insert: {
          activity_id: string
          content: Json
          correct_answer?: string | null
          created_at?: string
          id?: string
          item_type: string
          order_index: number
        }
        Update: {
          activity_id?: string
          content?: Json
          correct_answer?: string | null
          created_at?: string
          id?: string
          item_type?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_items_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_responses: {
        Row: {
          activity_id: string
          completed: boolean | null
          created_at: string
          id: string
          responses: Json
          score: number | null
          user_id: string | null
        }
        Insert: {
          activity_id: string
          completed?: boolean | null
          created_at?: string
          id?: string
          responses: Json
          score?: number | null
          user_id?: string | null
        }
        Update: {
          activity_id?: string
          completed?: boolean | null
          created_at?: string
          id?: string
          responses?: Json
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_responses_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      bundle_links: {
        Row: {
          bundle_type: string
          created_at: string
          description: string | null
          id: string
          link_title: string | null
          link_url: string
          updated_at: string
        }
        Insert: {
          bundle_type: string
          created_at?: string
          description?: string | null
          id?: string
          link_title?: string | null
          link_url: string
          updated_at?: string
        }
        Update: {
          bundle_type?: string
          created_at?: string
          description?: string | null
          id?: string
          link_title?: string | null
          link_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      clock_worksheet_answer_zones: {
        Row: {
          correct_answer: string
          created_at: string
          height: number
          id: string
          order_index: number
          page_number: number
          updated_at: string
          width: number
          x_position: number
          y_position: number
        }
        Insert: {
          correct_answer: string
          created_at?: string
          height: number
          id?: string
          order_index: number
          page_number: number
          updated_at?: string
          width: number
          x_position: number
          y_position: number
        }
        Update: {
          correct_answer?: string
          created_at?: string
          height?: number
          id?: string
          order_index?: number
          page_number?: number
          updated_at?: string
          width?: number
          x_position?: number
          y_position?: number
        }
        Relationships: []
      }
      clock_worksheet_answers: {
        Row: {
          answer_zone_id: string | null
          clock_index: number
          correct_answer: string | null
          created_at: string
          id: string
          page_number: number
          student_answer: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          answer_zone_id?: string | null
          clock_index: number
          correct_answer?: string | null
          created_at?: string
          id?: string
          page_number: number
          student_answer?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          answer_zone_id?: string | null
          clock_index?: number
          correct_answer?: string | null
          created_at?: string
          id?: string
          page_number?: number
          student_answer?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clock_worksheet_answers_answer_zone_id_fkey"
            columns: ["answer_zone_id"]
            isOneToOne: false
            referencedRelation: "clock_worksheet_answer_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      clock_worksheet_correct_answers: {
        Row: {
          clock_index: number
          correct_answer: string
          created_at: string
          created_by: string | null
          id: string
          page_number: number
          updated_at: string
        }
        Insert: {
          clock_index: number
          correct_answer: string
          created_at?: string
          created_by?: string | null
          id?: string
          page_number: number
          updated_at?: string
        }
        Update: {
          clock_index?: number
          correct_answer?: string
          created_at?: string
          created_by?: string | null
          id?: string
          page_number?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      puzzle_answer_zones: {
        Row: {
          correct_answer: string
          created_at: string
          height: number
          id: string
          order_index: number
          puzzle_id: string
          updated_at: string
          width: number
          x_position: number
          y_position: number
        }
        Insert: {
          correct_answer: string
          created_at?: string
          height: number
          id?: string
          order_index: number
          puzzle_id: string
          updated_at?: string
          width: number
          x_position: number
          y_position: number
        }
        Update: {
          correct_answer?: string
          created_at?: string
          height?: number
          id?: string
          order_index?: number
          puzzle_id?: string
          updated_at?: string
          width?: number
          x_position?: number
          y_position?: number
        }
        Relationships: [
          {
            foreignKeyName: "puzzle_answer_zones_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles"
            referencedColumns: ["id"]
          },
        ]
      }
      puzzles: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      story_books: {
        Row: {
          category: string | null
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_books_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      story_pages: {
        Row: {
          audio_url: string | null
          created_at: string
          id: string
          image_url: string | null
          page_number: number
          story_book_id: string
          text_content: string
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          page_number: number
          story_book_id: string
          text_content: string
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          page_number?: number
          story_book_id?: string
          text_content?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_pages_story_book_id_fkey"
            columns: ["story_book_id"]
            isOneToOne: false
            referencedRelation: "story_books"
            referencedColumns: ["id"]
          },
        ]
      }
      user_purchases: {
        Row: {
          amount: number
          bundle_type: string
          created_at: string | null
          currency: string | null
          email: string
          id: string
          includes_ai_prompts: boolean | null
          purchased_at: string | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          bundle_type: string
          created_at?: string | null
          currency?: string | null
          email: string
          id?: string
          includes_ai_prompts?: boolean | null
          purchased_at?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          bundle_type?: string
          created_at?: string | null
          currency?: string | null
          email?: string
          id?: string
          includes_ai_prompts?: boolean | null
          purchased_at?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
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
