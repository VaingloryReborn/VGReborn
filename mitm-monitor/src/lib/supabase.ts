import fs from "node:fs";
import path from "node:path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

function loadLocalSupabaseConfig(): {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_USER_TABLE?: string;
  SUPABASE_USER_ID_COLUMN?: string;
} {
  try {
    const file = path.join(__dirname, "..", "..", "supabase.local.json");
    if (!fs.existsSync(file)) {
      return {};
    }
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

const localSupabaseConfig = loadLocalSupabaseConfig();

const supabaseUrl =
  localSupabaseConfig.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey =
  localSupabaseConfig.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

export const wgPeersTable = process.env.WG_PEERS_TABLE || "wg_peers";
