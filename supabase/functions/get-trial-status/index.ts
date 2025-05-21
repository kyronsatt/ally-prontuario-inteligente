
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

    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .select('plan_type, trial_ends_at')
      .eq('id', user.id)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const now = new Date();
    const trialEndsAt = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
    
    const isTrial = trialEndsAt && trialEndsAt > now;
    const trialExpired = trialEndsAt && trialEndsAt <= now;
    
    let daysRemaining = 0;
    let hoursRemaining = 0;
    
    if (trialEndsAt && isTrial) {
      const diffTime = trialEndsAt.getTime() - now.getTime();
      daysRemaining = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      hoursRemaining = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    }
    
    return new Response(
      JSON.stringify({
        plan_type: profile.plan_type,
        is_trial: isTrial,
        trial_expired: trialExpired,
        trial_ends_at: profile.trial_ends_at,
        days_remaining: daysRemaining,
        hours_remaining: hoursRemaining
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
