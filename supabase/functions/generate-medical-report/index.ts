
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

function validateRequestData(requestData: Record<string, any>) {
  const requiredFields = [
    "transcription",
    "transcriptionId",
    "appointmentType",
    "appointmentId",
    "patientId",
    "patientInfo",
  ];
  requiredFields.forEach((field) => {
    if (!requestData[field]) {
      throw new Error(`No ${field} provided`);
    }
  });
}

async function generateAnamneseData(
  openai: OpenAI,
  requestData: Record<string, any>
) {
  const systemPrompt = createSystemPrompt(
    requestData.patientName,
    requestData.appointmentType,
    requestData.patientInfo,
    requestData.previousAnamnese,
    requestData.consultationNotes
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
  requestData: Record<string, any>,
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
  appointmentType: string,
  patientInfo: Record<string, string> = {},
  previousAnamnese: Record<string, string> | null = null,
  consultationNotes: string = ""
): string {
  const translateSex = (sex: string): string => {
    const sexTranslations: Record<string, string> = {
      MALE: "masculino",
      FEMALE: "feminino",
      OTHER: "outro",
    };
    return sexTranslations[sex] || "desconhecido";
  };

  const translateMaritalStatus = (status: string): string => {
    const maritalStatusTranslations: Record<string, string> = {
      SINGLE: "solteiro(a)",
      MARRIED: "casado(a)",
      DIVORCED: "divorciado(a)",
      WIDOWED: "viúvo(a)",
      OTHER: "outro",
    };
    return maritalStatusTranslations[status] || "desconhecido";
  };

  const infoParts: string[] = [];

  if (patientName) infoParts.push(`se chama ${patientName}`);
  if (patientInfo.age) infoParts.push(`tem ${patientInfo.age}`);
  if (patientInfo.sex)
    infoParts.push(`sexo biológico ${translateSex(patientInfo.sex)}`);
  if (patientInfo.gender) infoParts.push(`gênero ${patientInfo.gender}`);
  if (patientInfo.profession)
    infoParts.push(`atua como ${patientInfo.profession}`);
  if (patientInfo.color) infoParts.push(`cor/etnia ${patientInfo.color}`);
  if (patientInfo.housing) infoParts.push(`mora em ${patientInfo.housing}`);
  if (patientInfo.marital_status)
    infoParts.push(`é ${translateMaritalStatus(patientInfo.marital_status)}`);
  if (patientInfo.religion)
    infoParts.push(`segue a religião ${patientInfo.religion}`);

  const identification =
    infoParts.length > 0 ? `O paciente ${infoParts.join(", ")}.` : "";

  const isReturn = appointmentType === "RETURN";
  const returnNote =
    isReturn && previousAnamnese
      ? `Confira a anamnese anterior:
  - Queixa principal: ${previousAnamnese.main_complaint || "não disponível"}
  - História da doença atual: ${
    previousAnamnese.current_illness_history || "não disponível"
  }
  - Histórico médico pregresso: ${
    previousAnamnese.past_medical_history || "não disponível"
  }
  - Hipóteses diagnósticas: ${
    previousAnamnese.diagnostic_hypotheses || "não disponível"
  }
  - Abordagem terapêutica: ${
    previousAnamnese.therapeutic_approach || "não disponível"
  }
  - Exames complementares: ${
    previousAnamnese.complementary_exams || "não disponível"
  }
  - Exames físicos: ${previousAnamnese.physical_exams || "não disponível"}
  - Histórico social: ${previousAnamnese.social_history || "não disponível"}
  - Histórico familiar: ${previousAnamnese.family_history || "não disponível"}

  Compare os achados atuais com os anteriores. Destaque evoluções ou pioras, mantendo o que ainda for relevante.`
      : "";

  const notesNote = consultationNotes
    ? `
IMPORTANTE: O médico fez as seguintes anotações durante a consulta, que devem ser priorizadas na geração do relatório:

"""
${consultationNotes}
"""

Dê prioridade máxima a estas anotações do médico quando elaborar cada seção do relatório. Estas informações são mais importantes que a transcrição para compor o relatório final.`
    : "";

  return `Você é um assistente médico que gera anamneses estruturadas com base em transcrições de consultas.

          Com base na transcrição, produza uma anamnese em português. 
          Utilize termos médicos adequados (exceto no campo "main_complaint", onde jargões do paciente podem ser mantidos). 
          Esta é uma consulta ${
            appointmentType === "NEW" ? "inicial" : "de retorno"
          }.

          ${identification}

          ${returnNote}

          ${notesNote}

          Retorne os seguintes campos em JSON:
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

          Se alguma informação estiver ausente na transcrição, escreva: "Informação não fornecida na consulta".

          Use Markdown básico para formatação: **negrito**, _itálico_, __sublinhado__ e listas.

          Não inclua conteúdos fora desses campos. Seja objetivo.
    `;
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
