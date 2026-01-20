export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          handle: string | null
          country: string | null
          region: string | null
          player_uuid: string | null
          session_token: string | null
          state: string | null
          get_player_info: Json | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          handle?: string | null
          country?: string | null
          region?: string | null
          player_uuid?: string | null
          session_token?: string | null
          state?: string | null
          get_player_info?: Json | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          handle?: string | null
          country?: string | null
          region?: string | null
          player_uuid?: string | null
          session_token?: string | null
          state?: string | null
          get_player_info?: Json | null
        }
      }
      // Add other tables here if needed (e.g. wg_peers)
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
  }
}
