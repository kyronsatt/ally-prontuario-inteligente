// @ts-expect-error :: deno
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error :: deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
// @ts-expect-error :: deno
import OpenAI from "https://esm.sh/openai@4.20.1";
// @ts-expect-error :: deno
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const { supabaseClient, jwt } = await validateAuthHeader(authHeader);
    const requestData = await req.json();

    validateRequestData(requestData);

    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    const anamneseData = await generateAnamneseData(openai, requestData);

    const userData = await getUserData(supabaseClient, jwt);

    await insertAnamneseIntoDb(
      supabaseClient,
      anamneseData,
      requestData,
      userData
    );

    return new Response(JSON.stringify(anamneseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-anamnese function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function validateAuthHeader(authHeader: string | null) {
  if (!authHeader) {
    throw new Error("No authorization header");
  }

  const jwt = authHeader.replace("Bearer ", "").trim();

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are missing");
    throw new Error("Supabase configuration is missing");
  }

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  return { supabaseClient, jwt };
}

function validateRequestData(requestData: Record<string, string>) {
  const requiredFields = [
    "transcription",
    "transcriptionId",
    "appointmentType",
    "appointmentId",
    "patientId",
  ];
  requiredFields.forEach((field) => {
    if (!requestData[field]) {
      throw new Error(`No ${field} provided`);
    }
  });
}

async function generateAnamneseData(
  openai: OpenAI,
  requestData: Record<string, string>
) {
  const systemPrompt = createSystemPrompt(
    requestData.patientName,
    requestData.appointmentType
  );

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: requestData.transcription },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "anamnese_default_v1",
        strict: true,
        schema: anamneseSchema,
      },
    },
    temperature: 0.5,
  });

  const { finish_reason, message } = completion.choices[0];

  if (finish_reason !== "stop") {
    throw new Error("Modelo não concluiu a resposta corretamente.");
  }

  try {
    return JSON.parse(message.content);
  } catch (error) {
    throw new Error("Erro ao analisar a resposta JSON: " + error.message);
  }
}

async function getUserData(supabaseClient: SupabaseClient, jwt: string) {
  const { data: userData, error: userError } =
    await supabaseClient.auth.getUser(jwt);

  if (userError || !userData?.user?.id) {
    throw new Error("Failed to retrieve user information");
  }

  return userData;
}

async function insertAnamneseIntoDb(
  supabaseClient: SupabaseClient,
  anamneseData: Record<string, unknown>,
  requestData: Record<string, unknown>,
  userData: Record<string, Record<string, unknown>>
) {
  const { data: insertData, error: insertError } = await supabaseClient
    .from("anamnese")
    .insert([
      {
        appointment_id: requestData.appointmentId,
        transcription_id: requestData.transcriptionId,
        patient_id: requestData.patientId,
        identification: anamneseData.identification,
        main_complaint: anamneseData.main_complaint,
        current_illness_history: anamneseData.current_illness_history,
        past_medical_history: anamneseData.past_medical_history,
        social_history: anamneseData.social_history,
        family_history: anamneseData.family_history,
        physical_exams: anamneseData.physical_exams,
        complementary_exams: anamneseData.complementary_exams,
        therapeutic_approach: anamneseData.therapeutic_approach,
        diagnostic_hypotheses: anamneseData.diagnostic_hypotheses,
        created_by: userData.user.id,
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error("Error inserting anamnese into database:", insertError);
    throw new Error("Failed to insert anamnese into database");
  }

  return insertData;
}

function createSystemPrompt(
  patientName: string,
  appointmentType: string
): string {
  return `Você é um assistente médico especializado em gerar anamneses estruturadas a partir de transcrições de consultas.

Com base na transcrição fornecida, gere uma anamnese completa em português, utilizando termos médicos apropriados. Evite jargões, exceto no campo "main_complaint".

O paciente é ${patientName || "desconhecido"} e esta é uma consulta ${
    appointmentType === "NEW" ? "inicial" : "de retorno"
  }.

Retorne os seguintes campos em formato JSON:

- identification
- main_complaint
- current_illness_history
- past_medical_history
- social_history
- family_history
- physical_exams
- complementary_exams
- therapeutic_approach
- diagnostic_hypotheses

Se alguma informação não estiver presente na transcrição, indique claramente com "Informação não fornecida na consulta".

Não inclua informações adicionais fora desses campos. Seja claro e conciso.`;
}

const anamneseSchema = {
  type: "object",
  properties: {
    identification: {
      type: "string",
      description: "Identificação do paciente",
    },
    main_complaint: {
      type: "string",
      description: "Queixa principal (pode conter jargões)",
    },
    current_illness_history: {
      type: "string",
      description: "História da doença atual",
    },
    past_medical_history: {
      type: "string",
      description: "Histórico médico pregresso",
    },
    social_history: { type: "string", description: "Histórico social" },
    family_history: { type: "string", description: "Histórico familiar" },
    physical_exams: { type: "string", description: "Exames físicos" },
    complementary_exams: {
      type: "string",
      description: "Exames complementares",
    },
    therapeutic_approach: {
      type: "string",
      description: "Abordagem terapêutica",
    },
    diagnostic_hypotheses: {
      type: "string",
      description: "Hipóteses diagnósticas",
    },
  },
  required: [
    "identification",
    "main_complaint",
    "current_illness_history",
    "past_medical_history",
    "social_history",
    "family_history",
    "physical_exams",
    "complementary_exams",
    "therapeutic_approach",
    "diagnostic_hypotheses",
  ],
  additionalProperties: false,
};
