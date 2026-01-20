import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { x25519 } from "https://esm.sh/@noble/curves@1.4.0/ed25519"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0"

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function generateWireGuardKeyPair() {
  const priv = x25519.utils.randomPrivateKey()
  const pub = x25519.getPublicKey(priv)
  return {
    privateKey: bytesToBase64(priv),
    publicKey: bytesToBase64(pub),
  }
}

function pickRandomIp() {
  const host = 2 + Math.floor(Math.random() * 253)
  return `10.8.0.${host}/32`
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 })
  }

  const url = new URL(req.url)
  const format = url.searchParams.get("format") ?? ""

  let userId: string | null = null
  try {
    const claims = (req as any).jwt as { sub?: string } | undefined
    if (claims && typeof claims.sub === "string") {
      userId = claims.sub
    }
  } catch {
  }

  const { privateKey, publicKey } = generateWireGuardKeyPair()
  const address = pickRandomIp()

  const serverPublicKey = Deno.env.get("WG_SERVER_PUBLIC_KEY") ?? "<SERVER_PUBLIC_KEY>"
  const endpoint = Deno.env.get("WG_ENDPOINT") ?? "<YOUR_SERVER_IP>:443"
  const allowedIps = Deno.env.get("WG_ALLOWED_IPS") ?? "0.0.0.0/0"
  const dns = Deno.env.get("WG_DNS") ?? "8.8.8.8"

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  if (supabaseUrl && supabaseServiceKey && userId) {
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      await supabase.from("wg_peers").insert({
        user_id: userId,
        public_key: publicKey,
        ip_address: address,
      })
    } catch {
    }
  }

  const clientConf = [
    "[Interface]",
    `Address = ${address}`,
    `PrivateKey = ${privateKey}`,
    `DNS = ${dns}`,
    "MTU = 1280",
    "",
    "[Peer]",
    `PublicKey = ${serverPublicKey}`,
    `Endpoint = ${endpoint}`,
    `AllowedIPs = ${allowedIps}`,
    "PersistentKeepalive = 25",
    "",
  ].join("\n")

  if (format === "conf" || format === "raw") {
    return new Response(clientConf, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": "attachment; filename=\"client.conf\"",
      },
    })
  } else {
    const body = {
      userId,
      publicKey,
      address,
      clientConf,
    }
    return new Response(JSON.stringify(body), {
      headers: { "Content-Type": "application/json" },
    })
  }
})
