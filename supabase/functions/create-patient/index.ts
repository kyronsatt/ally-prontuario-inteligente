import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { name, age, gender, is_new, created_by } = await req.json();
    // Log the incoming data for debugging
    console.log("Received data:", {
      name,
      age,
      gender,
      is_new,
      created_by,
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabaseClient
      .from("patients")
      .insert([
        {
          name,
          age,
          gender,
          is_new,
          created_by,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting patient:", error);
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Allow all origins
          },
          status: 400,
        }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
      status: 201,
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
          "Access-Control-Allow-Origin": "*", // Allow all origins
        },
        status: 500,
      }
    );
  }
});
