// @ts-expect-error: Deno doesn't support this yet
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @ts-expect-error: Deno doesn't support this yet
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
// Constantes de CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
// Funções auxiliares
/**
 * Processa a string base64 em pedaços de áudio binário.
 * @param base64String A string base64 do áudio
 * @param chunkSize O tamanho do pedaço a ser processado
 * @returns O áudio binário como um Uint8Array
 */ function processBase64Chunks(base64String, chunkSize = 32768) {
  const chunks = [];
  let position = 0;
  while(position < base64String.length){
    const chunk = base64String.slice(position, position + chunkSize);
    chunks.push(base64ToBinary(chunk));
    position += chunkSize;
  }
  return concatenateChunks(chunks);
}
/**
 * Converte uma parte base64 em binário (Uint8Array).
 * @param base64 A parte em base64
 * @returns A parte convertida em Uint8Array
 */ function base64ToBinary(base64) {
  const binaryChunk = atob(base64);
  const bytes = new Uint8Array(binaryChunk.length);
  for(let i = 0; i < binaryChunk.length; i++){
    bytes[i] = binaryChunk.charCodeAt(i);
  }
  return bytes;
}
/**
 * Concatena todos os pedaços binários em um único Uint8Array.
 * @param chunks Pedaços binários
 * @returns O áudio binário concatenado
 */ function concatenateChunks(chunks) {
  const totalLength = chunks.reduce((acc, chunk)=>acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks){
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
/**
 * Extrai o texto corrido e os segmentos do JSON de resposta do Whisper.
 * @param whisperResponse Resposta JSON do Whisper
 * @returns Um objeto com o texto corrido e segmentos
 */ function extractTranscriptionData(whisperResponse) {
  const rawText = whisperResponse.text?.trim() || "";
  const segments = {};
  for (const segment of whisperResponse.segments || []){
    const timestamp = formatTimestamp(segment.start);
    segments[timestamp] = segment.text.trim();
  }
  return {
    rawText,
    segments
  };
}
/**
 * Formata o timestamp para o formato HH:mm:ss.
 * @param startTime Tempo de início em segundos
 * @returns O timestamp formatado
 */ function formatTimestamp(startTime) {
  return new Date(startTime * 1000).toISOString().substr(11, 8); // HH:mm:ss
}
/**
 * Insere a transcrição no banco de dados Supabase.
 * @param supabaseClient Instância do cliente Supabase
 * @param rawText Texto corrido
 * @param segments Segmentos da transcrição
 * @param appointmentId ID do agendamento
 * @param transcriptionJson Resposta bruta do Whisper
 * @returns A resposta da inserção
 */ async function insertTranscriptionToDb(supabaseClient, rawText, segments, appointmentId, transcriptionJson) {
  return await supabaseClient.from("transcriptions").insert([
    {
      raw_text: rawText,
      segments: segments,
      appointment_id: appointmentId,
      errors: null,
      metadata: {
        model: "whisper-1",
        received_at: new Date().toISOString(),
        file_type: "audio/webm",
        raw_response: transcriptionJson
      }
    }
  ]).select().single();
}
/**
 * Faz a transcrição do áudio usando a API Whisper.
 * @param audio Dados de áudio em base64
 * @param openaiApiKey Chave da API OpenAI
 * @returns A resposta da transcrição
 */ async function transcribeAudio(audio, openaiApiKey) {
  const binaryAudio = processBase64Chunks(audio);
  const formData = new FormData();
  const blob = new Blob([
    binaryAudio
  ], {
    type: "audio/webm"
  });
  formData.append("file", blob, "audio.webm");
  formData.append("model", "whisper-1");
  formData.append("response_format", "verbose_json");
  const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`
    },
    body: formData
  });
  if (!whisperRes.ok) {
    const errorText = await whisperRes.text();
    throw new Error(`OpenAI API error: ${errorText}`);
  }
  return await whisperRes.json();
}
// Função principal de servidor
serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: "No authorization header"
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!supabaseUrl || !supabaseAnonKey || !openaiApiKey) {
      throw new Error("Missing environment variables for Supabase or OpenAI.");
    }
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error("Error getting user:", userError);
      return new Response(JSON.stringify({
        error: "Unauthorized"
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    const requestData = await req.json();
    const { audio, appointmentId } = requestData;
    if (!audio) throw new Error("No audio data provided");
    const transcriptionJson = await transcribeAudio(audio, openaiApiKey);
    const { rawText, segments } = extractTranscriptionData(transcriptionJson);
    const { data, error } = await insertTranscriptionToDb(supabaseClient, rawText, segments, appointmentId, transcriptionJson);
    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({
      status: "ok",
      data
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
