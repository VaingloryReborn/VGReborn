import { supabase, wgPeersTable } from "../lib/supabase";
import { CacheEntry } from "../types";

const userCache = new Map<string, CacheEntry>();
const lastActiveMap = new Map<string, number>();
const activeUserRefs = new Map<string, Record<string, any>>();
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

export async function getUserByClientIp(clientIp: string) {
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
    .or(`ip_address.eq.${clientIp},ip_address.eq.${clientIp}/32`)
    .limit(1);

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

export async function updateUser(
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

export function markUserActive(userId: string, user: Record<string, any>) {
  lastActiveMap.set(userId, Date.now());
  activeUserRefs.set(userId, user);
}

export function startOfflineMonitor() {
  setInterval(async () => {
    const now = Date.now();
    const TIMEOUT_MS = 2 * 60 * 1000;

    for (const [userId, lastSeen] of lastActiveMap) {
      if (now - lastSeen > TIMEOUT_MS) {
        const user = activeUserRefs.get(userId);
        if (user && user.state !== "offline" && user.state !== "playing") {
          console.log(
            `[Timeout] User ${userId} inactive for >1min. Setting offline.`,
          );
          await updateUser(user, { state: "offline" });
        }

        if (now - lastSeen > 3600 * 1000) {
          lastActiveMap.delete(userId);
          activeUserRefs.delete(userId);
        }
      }
    }
  }, 10000);
}
