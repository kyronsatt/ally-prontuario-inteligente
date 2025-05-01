import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    if (!user_id) {
      return new Response(
        JSON.stringify({
          error: "user_id query parameter is required",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 400,
        }
      );
    }
    // Log the incoming user_id for debugging
    console.log("Received user_id:", user_id);
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabaseClient
      .from("patients")
      .select("*")
      .eq("created_by", user_id);
    if (error) {
      console.error("Error fetching patients:", error);
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 400,
        }
      );
    }
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    });
  } catch (err) {
    console.error("Error processing request:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      }
    );
  }
});
