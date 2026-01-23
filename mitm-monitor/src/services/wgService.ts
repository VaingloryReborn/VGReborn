import { exec } from "node:child_process";
import { promisify } from "node:util";
import { supabase, wgPeersTable } from "../lib/supabase";

const execAsync = promisify(exec);
const WG_INTERFACE = process.env.WG_INTERFACE || "wg0";

export async function syncPeer(publicKey: string, ipAddress: string) {
  if (!publicKey || !ipAddress) return;

  // Remove CIDR suffix if present (e.g. 10.8.0.2/32 -> 10.8.0.2)
  const ip = ipAddress.split("/")[0];

  // wg set wg0 peer <KEY> allowed-ips <IP>/32
  // This command is non-destructive to other peers and connections
  const cmd = `wg set ${WG_INTERFACE} peer "${publicKey}" allowed-ips ${ip}/32`;

  try {
    await execAsync(cmd);
    console.log(
      `[WG] Successfully synced peer ${ip} (${publicKey.slice(0, 6)}...)`,
    );
  } catch (error: any) {
    // If command not found, probably running locally on dev machine
    if (error.code === 127 || error.message.includes("command not found")) {
      console.warn(
        `[WG] 'wg' command not found. Skipping sync for ${ip}. (Are you running locally?)`,
      );
    } else {
      console.error(`[WG] Failed to sync peer ${ip}:`, error.message);
    }
  }
}

export async function removePeer(publicKey: string) {
  if (!publicKey) return;

  const cmd = `wg set ${WG_INTERFACE} peer "${publicKey}" remove`;

  try {
    await execAsync(cmd);
    console.log(`[WG] Successfully removed peer (${publicKey.slice(0, 6)}...)`);
  } catch (error: any) {
    if (error.code === 127 || error.message.includes("command not found")) {
      console.warn(
        `[WG] 'wg' command not found. Skipping remove. (Are you running locally?)`,
      );
    } else {
      console.error(`[WG] Failed to remove peer:`, error.message);
    }
  }
}

export async function startWireGuardSync() {
  if (!supabase) {
    console.error("[WG] Supabase client not initialized, skipping WG sync");
    return;
  }

  // Check if we are on a system with WireGuard
  try {
    await execAsync("wg --version");
  } catch (e) {
    console.warn(
      "[WG] WireGuard tools not found. Sync service will run in LOG-ONLY mode.",
    );
  }

  console.log("[WG] Starting WireGuard peer sync...");

  // 1. Initial Sync: Load all existing peers from DB and apply them
  const { data: peers, error } = await supabase
    .from(wgPeersTable)
    .select("public_key, ip_address");

  if (error) {
    console.error("[WG] Failed to fetch initial peers:", error);
  } else if (peers) {
    console.log(`[WG] Found ${peers.length} peers in database. Syncing...`);
    for (const peer of peers) {
      // Assuming columns are snake_case
      const p = peer as any;
      if (p.public_key && p.ip_address) {
        await syncPeer(p.public_key, p.ip_address);
      }
    }
    console.log("[WG] Initial sync completed.");
  }

  // 2. Realtime Sync: Listen for new/updated peers
  // Note: Using Supabase v1 syntax
  supabase
    .from(wgPeersTable)
    .on("INSERT", (payload: any) => {
      console.log("[WG] New peer detected:", payload.new);
      const newPeer = payload.new;
      syncPeer(newPeer.public_key, newPeer.ip_address);
    })
    .on("UPDATE", (payload: any) => {
      const newPeer = payload.new;
      const oldPeer = payload.old;

      // Only sync if keys or IP changed
      if (
        newPeer.public_key !== oldPeer.public_key ||
        newPeer.ip_address !== oldPeer.ip_address
      ) {
        console.log("[WG] Peer updated:", payload.new);
        syncPeer(newPeer.public_key, newPeer.ip_address);
        // If public key changed, remove the old one
        if (
          oldPeer &&
          oldPeer.public_key &&
          oldPeer.public_key !== newPeer.public_key
        ) {
          console.log(
            `[WG] Public key changed from ${oldPeer.public_key.slice(0, 6)}... to ${newPeer.public_key.slice(0, 6)}... Removing old peer.`,
          );
          removePeer(oldPeer.public_key);
        } else if (oldPeer && !oldPeer.public_key) {
          console.warn(
            "[WG] Peer updated but old public_key missing. Ensure REPLICA IDENTITY FULL is set.",
          );
        }
      }
    })
    .on("DELETE", (payload: any) => {
      console.log("[WG] Peer deleted:", payload.old);
      const oldPeer = payload.old;
      if (oldPeer && oldPeer.public_key) {
        removePeer(oldPeer.public_key);
      } else {
        console.warn(
          "[WG] Cannot remove peer: 'public_key' missing in delete payload. Ensure REPLICA IDENTITY FULL is set for 'wg_peers'.",
        );
      }
    })
    .subscribe((status: string) => {
      console.log(`[WG] Realtime subscription status: ${status}`);
    });
}
