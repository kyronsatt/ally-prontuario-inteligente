
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import OpenAI from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the auth token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { transcription, patientName, appointmentType } = await req.json();
    
    if (!transcription) {
      throw new Error('No transcription provided');
    }

    console.log("Received transcription, generating medical reports...");

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Create system prompt for medical report generation
    const systemPrompt = `Você é um assistente médico especializado em gerar prontuários a partir de transcrições de consultas.
Gere um prontuário completo com base na transcrição fornecida.
O paciente é ${patientName || "desconhecido"} e este é um atendimento ${appointmentType === "NEW" ? "inicial" : "de retorno"}.

Você deve gerar DOIS formatos diferentes de prontuário:

1. Formato SOAP (Subjetivo, Objetivo, Avaliação e Plano)
2. Formato de Anamnese Estruturada (com Queixa Principal, História da Doença Atual, Antecedentes Patológicos, 
   Medicações em Uso, Hábitos de Vida, Exames Físicos, Exames Complementares, Diagnóstico e Conduta)

Forneça os dois formatos como objetos JSON estruturados, não como texto livre. Siga EXATAMENTE esta estrutura:

{
  "soapNote": {
    "subjective": "...",
    "objective": "...",
    "assessment": "...",
    "plan": "..."
  },
  "anamneseNote": {
    "queixaPrincipal": "...",
    "historiaDoencaAtual": "...",
    "antecedentesPatologicos": "...",
    "medicacoesEmUso": "...",
    "habitosDeVida": "...",
    "examesFisicos": "...",
    "examesComplementares": "...",
    "diagnostico": "...",
    "conduta": "..."
  }
}

Crie respostas completas e profissionais em cada campo. Se alguma informação não estiver disponível na transcrição, 
indique isso claramente com "Informação não fornecida na consulta" no campo correspondente.
Não invente informações que não estão na transcrição.`;

    // Make OpenAI API request
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: transcription }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    // Parse the response and ensure it has the correct structure
    const responseContent = completion.choices[0].message.content;
    let parsedResponse;
    
    try {
      parsedResponse = JSON.parse(responseContent);
      
      // Validate response structure
      if (!parsedResponse.soapNote || !parsedResponse.anamneseNote) {
        throw new Error("Response missing required structure");
      }
      
    } catch (e) {
      console.error("Failed to parse OpenAI response:", e);
      throw new Error("Failed to generate properly structured medical report");
    }

    console.log("Medical reports generated successfully");

    // Update user's appointment statistics
    try {
      const { error: statsError } = await supabaseClient
        .from('appointment_stats')
        .upsert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          total_appointments: 1,
          new_patients: appointmentType === 'NEW' ? 1 : 0,
          time_saved_minutes: 15 // Estimate of time saved
        }, {
          onConflict: 'user_id,date',
          ignoreDuplicates: false
        });

      if (statsError) {
        console.error("Error updating appointment stats:", statsError);
      }
    } catch (statsErr) {
      console.error("Failed to update appointment statistics:", statsErr);
    }

    return new Response(
      responseContent,
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-medical-report function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
