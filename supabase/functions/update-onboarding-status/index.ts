
// Follow this setup guide to integrate the Deno runtime into your application:
// https://docs.supabase.com/reference/javascript/installing

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const { step, completed } = await req.json();
    
    // First get current onboarding status
    const { data: profile, error: fetchError } = await supabaseClient
      .from('profiles')
      .select('onboarding_steps_completed, has_finished_onboarding')
      .eq('id', user.id)
      .single();
      
    if (fetchError) {
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Update the onboarding steps
    let updatedSteps = [...(profile.onboarding_steps_completed || [])];
    
    if (completed && !updatedSteps.includes(step)) {
      updatedSteps.push(step);
    } else if (!completed && updatedSteps.includes(step)) {
      updatedSteps = updatedSteps.filter(s => s !== step);
    }
    
    const allStepsCompleted = ['start_consultation', 'generate_anamnese', 'view_insights', 'check_history', 'configure_profile']
      .every(requiredStep => updatedSteps.includes(requiredStep));
    
    // Update the profile
    const { data, error: updateError } = await supabaseClient
      .from('profiles')
      .update({ 
        onboarding_steps_completed: updatedSteps,
        has_finished_onboarding: allStepsCompleted || profile.has_finished_onboarding
      })
      .eq('id', user.id);
      
    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({
        steps_completed: updatedSteps,
        has_finished_onboarding: allStepsCompleted || profile.has_finished_onboarding
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
