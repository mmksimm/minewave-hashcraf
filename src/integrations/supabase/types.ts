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
      daily_tasks: {
        Row: {
          completed: boolean | null
          date: string | null
          id: number
          miner_id: number | null
          mining_time_minutes: number | null
          shares_found: number | null
          tokens_rewarded: number | null
        }
        Insert: {
          completed?: boolean | null
          date?: string | null
          id?: number
          miner_id?: number | null
          mining_time_minutes?: number | null
          shares_found?: number | null
          tokens_rewarded?: number | null
        }
        Update: {
          completed?: boolean | null
          date?: string | null
          id?: number
          miner_id?: number | null
          mining_time_minutes?: number | null
          shares_found?: number | null
          tokens_rewarded?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_tasks_miner_id_fkey"
            columns: ["miner_id"]
            isOneToOne: false
            referencedRelation: "miners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_tasks_miner_id_fkey"
            columns: ["miner_id"]
            isOneToOne: false
            referencedRelation: "top_miners"
            referencedColumns: ["id"]
          },
        ]
      }
      miners: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: number
          last_name: string | null
          last_seen: string | null
          telegram_id: string
          tokens: number | null
          total_hash_rate: number | null
          total_shares: number | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          last_seen?: string | null
          telegram_id: string
          tokens?: number | null
          total_hash_rate?: number | null
          total_shares?: number | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          last_seen?: string | null
          telegram_id?: string
          tokens?: number | null
          total_hash_rate?: number | null
          total_shares?: number | null
          username?: string | null
        }
        Relationships: []
      }
      mining_sessions: {
        Row: {
          avg_hash_rate: number | null
          end_time: string | null
          id: number
          miner_id: number | null
          shares_found: number | null
          start_time: string | null
          tokens_earned: number | null
        }
        Insert: {
          avg_hash_rate?: number | null
          end_time?: string | null
          id?: number
          miner_id?: number | null
          shares_found?: number | null
          start_time?: string | null
          tokens_earned?: number | null
        }
        Update: {
          avg_hash_rate?: number | null
          end_time?: string | null
          id?: number
          miner_id?: number | null
          shares_found?: number | null
          start_time?: string | null
          tokens_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mining_sessions_miner_id_fkey"
            columns: ["miner_id"]
            isOneToOne: false
            referencedRelation: "miners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mining_sessions_miner_id_fkey"
            columns: ["miner_id"]
            isOneToOne: false
            referencedRelation: "top_miners"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      top_miners: {
        Row: {
          first_name: string | null
          id: number | null
          last_name: string | null
          rank: number | null
          tokens: number | null
          total_hash_rate: number | null
          total_shares: number | null
          username: string | null
        }
        Relationships: []
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
