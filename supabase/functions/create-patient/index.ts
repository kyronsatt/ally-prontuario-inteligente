import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const payload = await req.json();
    console.log("Received raw payload:", payload);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Remove fields with empty strings or undefined/null
    const sanitizedPayload = Object.fromEntries(
      Object.entries(payload).filter(
        ([_, v]) => v !== "" && v !== undefined && v !== null
      )
    );

    const { data, error } = await supabaseClient
      .from("patients")
      .insert([sanitizedPayload])
      .select()
      .single();

    if (error) {
      console.error("Error inserting patient:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: CORS_HEADERS,
        status: 400,
      });
    }

    return new Response(JSON.stringify(data), {
      headers: CORS_HEADERS,
      status: 201,
    });
  } catch (err) {
    console.error("Error processing request:", err);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        headers: CORS_HEADERS,
        status: 500,
      }
    );
  }
});
