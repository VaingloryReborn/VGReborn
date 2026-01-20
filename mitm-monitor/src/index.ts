import readline from "node:readline";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

type MitmLogEntry = {
  time?: string;
  client_ip?: string | null;
  method?: string;
  url?: string;
  status?: number;
  res_body?: unknown;
  [key: string]: unknown;
};

function loadLocalSupabaseConfig(): {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_USER_TABLE?: string;
  SUPABASE_USER_ID_COLUMN?: string;
} {
  try {
    const file = path.join(__dirname, "..", "supabase.local.json");
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
const supabase: SupabaseClient | null =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

const wgPeersTable = process.env.WG_PEERS_TABLE || "wg_peers";

const useStdin = process.argv.includes("stdin");

let input: NodeJS.ReadableStream;

if (useStdin) {
  input = process.stdin;
  console.log("mitm-monitor reading from stdin...");
} else {
  const unit = process.env.MITM_UNIT || "mitm-proxy";
  const child = spawn("journalctl", ["-u", unit, "-f", "-o", "cat"]);

  child.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
  });

  input = child.stdout;
  console.log(`mitm-monitor reading from journalctl -u ${unit} -f -o cat`);
}

type CacheEntry = {
  timestamp: number;
  data: { userId: string; user: Record<string, unknown> } | null;
};

const userCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hour
const MAX_CACHE_SIZE = 1000;

function cleanupCache() {
  const now = Date.now();
  for (const [key, entry] of userCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      userCache.delete(key);
    }
  }
  // If still too big, remove oldest
  if (userCache.size > MAX_CACHE_SIZE) {
    for (const key of userCache.keys()) {
      userCache.delete(key);
      if (userCache.size <= MAX_CACHE_SIZE) break;
    }
  }
}

async function getUserByClientIp(clientIp: string) {
  const now = Date.now();
  const cached = userCache.get(clientIp);

  if (cached) {
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    userCache.delete(clientIp);
  }

  if (!supabase) {
    return null;
  }

  const { data: peers, error } = await supabase
    .from(wgPeersTable)
    .select("user_id")
    .eq("ip_address", clientIp)
    .limit(1);

  // console.log("supabase wg_peers query", { clientIp, peers, error });

  if (error) {
    console.error("supabase wg_peers error", error);
    return null;
  }

  if (!peers || peers.length === 0) {
    userCache.set(clientIp, { timestamp: now, data: null });
    return null;
  }

  const userId = (peers[0] as any).user_id as string | null | undefined;
  if (!userId) {
    userCache.set(clientIp, { timestamp: now, data: null });
    return null;
  }

  // Fetch from profiles table instead of auth.users
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("supabase profile fetch error", profileError);
    return null;
  }

  if (!profile) {
    userCache.set(clientIp, { timestamp: now, data: null });
    return null;
  }

  const result = { userId, user: profile };
  userCache.set(clientIp, { timestamp: now, data: result });

  if (userCache.size > MAX_CACHE_SIZE) {
    cleanupCache();
  }

  return result;
}

async function updateUser(
  user: Record<string, any>,
  patch: Record<string, unknown>,
) {
  if (!supabase) {
    return;
  }
  if (!patch || Object.keys(patch).length === 0) {
    return;
  }

  const hasChanges = Object.keys(patch).some((key) => {
    const newVal = patch[key];
    const oldVal = user[key];

    if (
      typeof newVal === "object" &&
      newVal !== null &&
      typeof oldVal === "object" &&
      oldVal !== null
    ) {
      return JSON.stringify(newVal) !== JSON.stringify(oldVal);
    }
    return newVal !== oldVal;
  });

  if (!hasChanges) {
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id);

  if (error) {
    console.error(
      `[updateUser] Error updating profile for user ${user.id}:`,
      error,
    );
  } else {
    // Update local user object to reflect changes
    Object.assign(user, patch);
  }
}

async function handleEntry(entry: MitmLogEntry) {
  if (!entry.url) {
    return;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(entry.url);
  } catch {
    return;
  }

  if (parsedUrl.hostname !== "rpc.kindred-live.net") {
    return;
  }

  const clientIp = typeof entry.client_ip === "string" ? entry.client_ip : null;
  console.log("clientId", clientIp);
  if (!clientIp) {
    return;
  }

  const segments = parsedUrl.pathname.split("/").filter(Boolean);
  const action = segments[segments.length - 1];
  console.log("action", action);
  if (!action) {
    return;
  }

  const body = entry.res_body as Record<string, unknown> | null | undefined;
  if (!body || typeof body !== "object") {
    return;
  }

  const result = await getUserByClientIp(clientIp);
  if (!result) {
    return;
  }

  const { userId, user } = result;

  if (action === "startSessionForPlayer") {
    const returnValue = body.returnValue as Record<string, unknown> | undefined;
    const sessionToken = body.sessionToken as string;
    const patch: Record<string, unknown> = {
      state: "online",
    };
    patch.session_token = sessionToken;
    if (returnValue && typeof returnValue === "object") {
      if ("country" in returnValue) {
        patch.country = returnValue.country;
      }
      if ("region" in returnValue) {
        patch.region = returnValue.region;
      }
      if ("playerUUID" in returnValue) {
        patch.player_uuid = returnValue.playerUUID;
      }

      await updateUser(user, patch);
    }
  } else if (action === "update") {
    const returnValue = body.returnValue as Record<string, unknown> | undefined;
    if (returnValue?.state === "menus" && user.state === "offline") {
      await updateUser(user, { state: "online" });
      return;
    }
  } else if (action === "joinLobby") {
    await updateUser(user, { state: "matching" });
  } else if (action === "queryPendingMatch") {
    const returnValue = body.returnValue as Record<string, unknown> | undefined;
    if (returnValue && typeof returnValue === "object") {
      const isValid = returnValue.isValid === true;
      if (isValid) {
        await updateUser(user, {
          query_pending_match: returnValue.response,
          state: "matching",
        });
      } else {
        await updateUser(user, {
          query_pending_match: null,
          state: "online",
        });
      }
    }
  } else if (action === "friendListAll") {
    await updateUser(user, { state: "gaming" });
  } else if (action === "recordMatchExperienceMetrics") {
    await updateUser(user, { state: "recording" });
  } else if (action === "getPlayerInfo") {
    await updateUser(user, { state: "online" });
  } else if (action === "exitLobby") {
    await updateUser(user, { state: "online" });
  } else if (action === "endSession") {
    await updateUser(user, { state: "offline" });
  } else if (action === "renamePlayerHandle") {
    const returnValue = body.returnValue as Record<string, unknown> | undefined;
    if (
      returnValue &&
      typeof returnValue === "object" &&
      "handle" in returnValue
    ) {
      await updateUser(user, { handle: returnValue.handle });
    }
  }
}

const rl = readline.createInterface({
  input,
  crlfDelay: Infinity,
});

rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) {
    return;
  }

  if (/^[-=]{5,}$/.test(trimmed)) {
    return;
  }

  try {
    if (!trimmed.includes("{") || !trimmed.includes("}")) {
      return;
    }

    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    const jsonText = trimmed.slice(start, end + 1);

    const data = JSON.parse(jsonText) as MitmLogEntry;
    const output: MitmLogEntry = {
      time: data.time,
      client_ip: data.client_ip,
      method: data.method,
      url: data.url,
      status: data.status,
      res_body: data.res_body,
    };

    void handleEntry(output);

    process.stdout.write(`${JSON.stringify(output)}\n`);
  } catch {}
});

rl.on("close", () => {
  console.log("mitm-monitor input closed");
});
