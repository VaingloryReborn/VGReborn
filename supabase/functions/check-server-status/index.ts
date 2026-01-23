import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { ip } = await req.json();

    if (!ip) {
      throw new Error("IP address is required");
    }

    console.log(`Checking connection to http://${ip}...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(`http://${ip}`, {
      method: "HEAD",
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    return new Response(
      JSON.stringify({
        success: response.ok,
        status: response.status,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Connection check failed:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // Return 200 to handle error gracefully in frontend
      }
    );
  }
});
