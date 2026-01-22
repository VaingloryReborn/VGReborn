import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.48.0"
import { ipToNum, numToIp } from "./ip.ts"

export interface Peer {
  user_id: string;
  public_key: string;
  ip_address: string;
}

export async function findUserPeer(supabase: SupabaseClient, userId: string): Promise<Peer | null> {
  const { data: existingPeers, error } = await supabase
    .from("wg_peers")
    .select("*")
    .eq("user_id", userId)
    .limit(1);

  if (error) throw error;
  return (existingPeers && existingPeers.length > 0) ? existingPeers[0] : null;
}

export async function allocateNextIp(supabase: SupabaseClient): Promise<string> {
  const { data: peers, error } = await supabase
    .from("wg_peers")
    .select("ip_address")
  
  if (error) throw error;

  let address = "10.8.0.2/32"

  if (peers && peers.length > 0) {
    const usedIps = new Set(peers.map((p: any) => p.ip_address.split('/')[0]));
    
    let maxIpNum = 0;
    peers.forEach((p: any) => {
      const num = ipToNum(p.ip_address);
      if (num > maxIpNum) maxIpNum = num;
    });

    if (maxIpNum === 0) {
      maxIpNum = ipToNum("10.8.0.1");
    }

    let nextIpNum = maxIpNum + 1;
    while (true) {
      const ipStr = numToIp(nextIpNum).split('/')[0];
      const parts = ipStr.split('.').map(Number);
      const lastByte = parts[3];

      if (lastByte === 0 || lastByte === 1 || lastByte === 255 || usedIps.has(ipStr)) {
        nextIpNum++;
      } else {
        break;
      }
    }
    address = numToIp(nextIpNum);
  }

  return address;
}

export async function upsertPeer(
  supabase: SupabaseClient, 
  userId: string, 
  publicKey: string, 
  ipAddress: string, 
  isNew: boolean
) {
  if (isNew) {
    const { error } = await supabase.from("wg_peers").insert({
      user_id: userId,
      public_key: publicKey,
      ip_address: ipAddress,
    })
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("wg_peers")
      .update({ public_key: publicKey })
      .eq("user_id", userId)
    if (error) throw error;
  }
}
