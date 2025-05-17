
// @ts-expect-error :: deno
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error :: deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
// @ts-expect-error :: deno
import OpenAI from "https://esm.sh/openai@4.20.1";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
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
    const anamneseEntry = await insertAnamneseIntoDb(
      supabaseClient,
      anamneseData,
      requestData,
      userData
    );
    
    // Update productivity metrics after inserting the anamnese
    await updateProductivityMetrics(supabaseClient, userData.user.id);
    
    return new Response(JSON.stringify(anamneseEntry), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in generate-anamnese function:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

async function validateAuthHeader(authHeader) {
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
  return {
    supabaseClient,
    jwt,
  };
}
function validateRequestData(requestData) {
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

const insightsSchema = {
  type: "array",
  description: "Insights clínicos extraídos da anamnese",
  items: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["risk", "finding", "suggestion", "red_flag"],
      },
      label: {
        type: "string",
      },
      content: {
        type: "string",
      },
    },
    required: ["type", "label", "content"],
    additionalProperties: false,
  },
};

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
    social_history: {
      type: "string",
      description: "Histórico social",
    },
    family_history: {
      type: "string",
      description: "Histórico familiar",
    },
    physical_exams: {
      type: "string",
      description: "Exames físicos",
    },
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
  additionalProperties: false, // Adicionado conforme necessário
};

async function generateAnamneseData(openai, requestData) {
  const systemPrompt = createSystemPrompt(
    requestData.patientName,
    requestData.appointmentType,
    requestData.patientInfo,
    requestData.previousAnamnese,
    requestData.appointmentNotes
  );
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: requestData.transcription,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "anamnese_default_v2",
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
    const anamneseData = JSON.parse(message.content);
    // Generate clinical insights
    const insightsCompletion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content: `Você é um assistente médico especializado em extrair insights clínicos de anamneses médicas.
          
          Com base na anamnese fornecida, identifique insights clínicos relevantes como:
          - Riscos que o paciente apresenta
          - Achados importantes que merecem atenção
          - Sugestões diagnósticas ou terapêuticas importantes
          - Sinais de alerta ('red flags') que exigem atenção imediata
          
          Retorne os insights em formato JSON, com cada insight contendo:
          - id: um UUID único (pode usar números sequenciais para simplicidade)
          - type: o tipo do insight (risk, finding, suggestion, red_flag)
          - label: um rótulo legível para o tipo (em português)
          - content: texto do insight em português
          - highlighted_text: (opcional) trecho da anamnese que embasa o insight
          
          Limite-se a no máximo 3 insights realmente relevantes e evite repetições ou redundâncias.`,
        },
        {
          role: "user",
          content: `Anamnese médica:
          
          Identificação: ${anamneseData.identification}
          Queixa Principal: ${anamneseData.main_complaint}
          História da Doença Atual: ${anamneseData.current_illness_history}
          História Patológica Pregressa: ${anamneseData.past_medical_history}
          Histórico Social: ${anamneseData.social_history}
          Histórico Familiar: ${anamneseData.family_history}
          Exames Físicos: ${anamneseData.physical_exams}
          Exames Complementares: ${anamneseData.complementary_exams}
          Abordagem Terapêutica: ${anamneseData.therapeutic_approach}
          Hipóteses Diagnósticas: ${anamneseData.diagnostic_hypotheses}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "insights_schema_v1",
          strict: true,
          schema: {
            type: "object",
            properties: {
              insights: insightsSchema,
            },
            required: ["insights"],
            additionalProperties: false,
          },
        },
      },
      temperature: 0.3,
    });

    try {
      const insightsData = JSON.parse(
        insightsCompletion.choices[0].message.content
      );

      anamneseData.insights = insightsData.insights;
    } catch (error) {
      console.error("Error parsing insights response:", error);
      anamneseData.insights = [];
    }
    return anamneseData;
  } catch (error) {
    throw new Error("Erro ao analisar a resposta JSON: " + error.message);
  }
}
async function getUserData(supabaseClient, jwt) {
  const { data: userData, error: userError } =
    await supabaseClient.auth.getUser(jwt);
  if (userError || !userData?.user?.id) {
    throw new Error("Failed to retrieve user information");
  }
  return userData;
}
async function insertAnamneseIntoDb(
  supabaseClient,
  anamneseData,
  requestData,
  userData
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
        insights: anamneseData.insights || [],
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
  appointmentNotes: string = ""
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
  const notesNote =
    appointmentNotes && appointmentNotes !== ""
      ? `
      IMPORTANTE: O médico fez as seguintes anotações durante a consulta, que devem ser priorizadas na geração do relatório:
      """${appointmentNotes}"""
      Dê prioridade máxima a estas anotações do médico quando elaborar cada seção do relatório.`
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

// New function to update productivity metrics
async function updateProductivityMetrics(supabaseClient, userId) {
  try {
    console.log("Updating productivity metrics for user:", userId);
    
    // Constants for productivity calculations
    const TIME_WITH_ALLY_MINUTES = 10;
    const TIME_REDUCTION_PERCENTAGE = 0.37;
    
    // Fetch the user's anamneses count and appointment data
    const { data: anamneseData, error: anamneseError } = await supabaseClient
      .from("anamnese")
      .select("id, created_at, appointment_id")
      .eq("created_by", userId);
      
    if (anamneseError) {
      console.error("Error fetching anamnese data:", anamneseError);
      throw new Error("Failed to fetch anamnese data");
    }
    
    // Count total appointments
    const totalAppointments = anamneseData?.length || 0;
    
    // Count new patients (based on the is_new flag in patients table)
    // First get all patient IDs from user's anamneses
    const appointmentIds = anamneseData?.map(a => a.appointment_id).filter(Boolean) || [];
    
    const { data: appointmentsData, error: appointmentsError } = await supabaseClient
      .from("appointments")
      .select("patient_id")
      .in("id", appointmentIds);
      
    if (appointmentsError) {
      console.error("Error fetching appointment data:", appointmentsError);
      throw new Error("Failed to fetch appointment data");
    }
    
    const patientIds = appointmentsData?.map(a => a.patient_id).filter(Boolean) || [];
    
    const { data: newPatientsData, error: newPatientsError } = await supabaseClient
      .from("patients")
      .select("id")
      .in("id", patientIds)
      .eq("is_new", true);
      
    if (newPatientsError) {
      console.error("Error fetching patient data:", newPatientsError);
      throw new Error("Failed to fetch patient data");
    }
    
    const newPatients = newPatientsData?.length || 0;
    
    // Calculate productivity metrics
    const timeWithoutAlly = TIME_WITH_ALLY_MINUTES / (1 - TIME_REDUCTION_PERCENTAGE);
    const timeSavedPerAppointment = timeWithoutAlly - TIME_WITH_ALLY_MINUTES;
    const totalTimeSavedMinutes = totalAppointments * timeSavedPerAppointment;
    
    // Insert or update the appointment_stats table
    const { data: existingStats, error: statsError } = await supabaseClient
      .from("appointment_stats")
      .select("id")
      .eq("user_id", userId)
      .eq("date", new Date().toISOString().split('T')[0])
      .maybeSingle();
      
    if (statsError) {
      console.error("Error checking existing stats:", statsError);
      throw new Error("Failed to check existing stats");
    }
    
    if (existingStats?.id) {
      // Update existing stats for today
      const { error: updateError } = await supabaseClient
        .from("appointment_stats")
        .update({
          total_appointments: totalAppointments,
          new_patients: newPatients,
          time_saved_minutes: Math.round(totalTimeSavedMinutes),
        })
        .eq("id", existingStats.id);
        
      if (updateError) {
        console.error("Error updating stats:", updateError);
        throw new Error("Failed to update productivity stats");
      }
    } else {
      // Insert new stats for today
      const { error: insertError } = await supabaseClient
        .from("appointment_stats")
        .insert({
          user_id: userId,
          total_appointments: totalAppointments,
          new_patients: newPatients,
          time_saved_minutes: Math.round(totalTimeSavedMinutes),
        });
        
      if (insertError) {
        console.error("Error inserting stats:", insertError);
        throw new Error("Failed to insert productivity stats");
      }
    }
    
    console.log("Successfully updated productivity metrics for user:", userId);
    return true;
  } catch (error) {
    console.error("Error in updateProductivityMetrics:", error);
    // Don't throw here to prevent the main function from failing
    return false;
  }
}
