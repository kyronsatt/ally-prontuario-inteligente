
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the user from the client
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error("Error getting user:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // First try to fetch today's stats
    let { data: statsData, error: statsError } = await supabaseClient
      .from('appointment_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    // If no stats exist for today, create default stats
    if (statsError || !statsData) {
      console.log("No stats for today, creating default stats");
      
      // Generate some random stats for demo purposes
      const totalAppointments = Math.floor(Math.random() * 10) + 1;
      const newPatients = Math.floor(Math.random() * (totalAppointments + 1));
      const timeSavedMinutes = totalAppointments * 15;
      
      const { data: insertData, error: insertError } = await supabaseClient
        .from('appointment_stats')
        .insert({
          user_id: user.id,
          date: today,
          total_appointments: totalAppointments,
          new_patients: newPatients,
          time_saved_minutes: timeSavedMinutes
        })
        .select()
        .single();
      
      if (insertError) {
        console.error("Error inserting stats:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to create stats" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      statsData = insertData;
    }

    // Fetch appointments
    const { data: appointments, error: appointmentsError } = await supabaseClient
      .from('appointments')
      .select('*, patients!inner(*)')
      .eq('doctor_id', user.id)
      .order('date', { ascending: false })
      .limit(5);

    if (appointmentsError) {
      console.error("Error fetching appointments:", appointmentsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch appointments" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return both stats and recent appointments
    return new Response(
      JSON.stringify({ 
        stats: statsData,
        recentAppointments: appointments || []
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
