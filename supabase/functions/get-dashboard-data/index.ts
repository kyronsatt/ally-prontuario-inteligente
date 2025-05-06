// @ts-expect-error: Deno doesn't support this yet
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @ts-expect-error: Deno doesn't support this yet
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "No authorization header",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { user_id } = await req.json();
    console.log("Parsed request body:", { user_id });

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase environment variables are missing");
      return new Response(
        JSON.stringify({ error: "Supabase configuration is missing" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Creating Supabase client");
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    const { data: statsData } = await supabaseClient
      .from("appointment_stats")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .single();

    // Return both stats and recent appointments
    return new Response(
      JSON.stringify({
        stats: statsData,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
