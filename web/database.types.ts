import { Lobby } from "./types";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          handle: string | null;
          country: string | null;
          region: string | null;
          player_uuid: string | null;
          session_token: string | null;
          state: string | null;
          get_player_info: Json | null;
          query_pending_match: Json[] | null;
          lobby?: Lobby;
          player_handle: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          handle?: string | null;
          country?: string | null;
          region?: string | null;
          player_uuid?: string | null;
          session_token?: string | null;
          state?: string | null;
          get_player_info?: Json | null;
          query_pending_match?: Json[] | null;
          lobby?: Lobby;
          player_handle?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          handle?: string | null;
          country?: string | null;
          region?: string | null;
          player_uuid?: string | null;
          session_token?: string | null;
          state?: string | null;
          get_player_info?: Json | null;
          query_pending_match?: Json[] | null;
          lobby?: Lobby;
          player_handle?: string | null;
        };
      };
      feedbacks: {
        Row: {
          id: number;
          created_at: string;
          user_id: string;
          content: string;
          contact: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          user_id: string;
          content: string;
          contact?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          user_id?: string;
          content?: string;
          contact?: string | null;
        };
      };
      // Add other tables here if needed (e.g. wg_peers)
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
