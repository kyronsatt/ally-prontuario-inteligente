import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  console.log("Request received:", { method: req.method, url: req.url });

  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { patient_id, doctor_id, type } = await req.json();
    console.log("Parsed request body:", { patient_id, doctor_id, type });

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

    console.log("Inserting appointment into database");
    const { data: appointmentData, error } = await supabaseClient
      .from("appointments")
      .insert([{ patient_id, doctor_id, type }])
      .select()
      .single();

    if (error) {
      console.error("Error inserting appointment:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Fetching patient data");
    const { data: patientData, error: patientError } = await supabaseClient
      .from("patients")
      .select("*")
      .eq("id", patient_id)
      .single();

    if (patientError) {
      console.error("Error fetching patient data:", patientError.message);
      return new Response(JSON.stringify({ error: patientError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Appointment and patient data retrieved successfully");
    const appointmentWithPatientInfo = {
      ...appointmentData,
      patient: patientData,
    };
    return new Response(JSON.stringify(appointmentWithPatientInfo), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 201,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
