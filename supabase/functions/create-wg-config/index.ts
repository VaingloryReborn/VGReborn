import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";
import { generateWireGuardKeyPair } from "./lib/crypto.ts";
import { findUserPeer, allocateNextIp, upsertPeer } from "./lib/db.ts";
import { generateClientConfig } from "./lib/config.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // 1. CORS & Method Check
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  // 2. Authenticate User
  let userId: string | null = null;
  const authHeader = req.headers.get("Authorization");
  if (authHeader) {
    try {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } },
      );
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // Ignore auth errors
    }
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 3. Initialize Admin Client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: "Server Configuration Error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
  const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // 4. Parse Request Body
    let bodyJson: any = {};
    let providedIp: string | null = null;
    try {
      bodyJson = await req.json();
      if (bodyJson && typeof bodyJson.ip === "string") {
        providedIp = bodyJson.ip;
      }
    } catch {
      // Body might be empty
    }

    // 5. Determine Endpoint
    const defaultEndpoint = Deno.env.get("WG_ENDPOINT") ?? "<YOUR_SERVER_IP>:443";
    let endpoint = defaultEndpoint;
    if (providedIp) {
      const minPort = 50000;
      const maxPort = 65499;
      const randomPort =
        Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
      endpoint = `${providedIp}:${randomPort}`;
    }

    // 6. Check Existing User Config
    let address = "";
    let isNew = true;

    const existingPeer = await findUserPeer(adminSupabase, userId);
    if (existingPeer) {
      address = existingPeer.ip_address;
      isNew = false;
    }

    // 7. Allocate IP if New
    if (isNew) {
      address = await allocateNextIp(adminSupabase);
    }

    // 8. Generate Keys & Upsert DB
    // Always generate new keys for security
    const { privateKey, publicKey } = generateWireGuardKeyPair();

    await upsertPeer(adminSupabase, userId, publicKey, address, isNew);

    // 9. Generate Config
    const serverPublicKey =
      Deno.env.get("WG_SERVER_PUBLIC_KEY") ?? "<SERVER_PUBLIC_KEY>";
    const allowedIps = Deno.env.get("WG_ALLOWED_IPS") ?? "0.0.0.0/0"
    const clientConf = generateClientConfig({
      address,
      privateKey,
      serverPublicKey,
      endpoint,
      allowedIps,
    });

    // 10. Return Response
    const url = new URL(req.url);
    const format = url.searchParams.get("format") ?? "";

    if (format === "conf" || format === "raw") {
      return new Response(clientConf, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": 'attachment; filename="client.conf"',
        },
      });
    } else {
      const body = {
        userId,
        publicKey,
        address,
        clientConf,
      };
      return new Response(JSON.stringify(body), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (err: any) {
    console.error("Handler Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
