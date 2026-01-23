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

/**
 * 启动离线监控服务
 * 定期检查用户的活跃状态，将超时不活跃的用户标记为离线
 */
export function startOfflineMonitor() {
  // 每10分钟执行一次检查
  setInterval(
    async () => {
      const now = Date.now();
      const MINUTES_2 = 2 * 60 * 1000; // 超时阈值：2分钟
      const MINUTES_10 = 30 * 60 * 1000;

      for (const [userId, lastSeen] of lastActiveMap) {
        // 如果用户超过2分钟没有活动
        if (now - lastSeen > MINUTES_2) {
          const user = activeUserRefs.get(userId);
          // 如果用户存在，且当前不是离线状态，也不是游戏中状态（游戏中可能不发送心跳）
          if (user && user.state !== "offline" && user.state !== "playing") {
            console.log(
              `[Timeout] User ${userId} inactive for >1min. Setting offline.`,
            );
            await updateUser(user, { state: "offline" });
          }

          // 如果用户超过30分钟没有活动，从内存中清除记录，防止内存泄漏
          if (now - lastSeen > 30 * 60 * 1000) {
            if (user) await updateUser(user, { state: "offline" });
            lastActiveMap.delete(userId);
            activeUserRefs.delete(userId);
          }
        }
      }
    },
    10 * 60 * 1000,
  );
}
