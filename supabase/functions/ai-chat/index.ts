import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Configuraciones de tono para el asistente
const toneConfigs = {
  profesional: {
    systemPrompt: `Eres un asistente de salud mental profesional y empático. Mantienes un tono serio pero comprensivo, utilizas terminología clínica apropiada cuando es necesario, y siempre ofreces respuestas basadas en evidencia científica. Respondes en español de Ecuador y mantienes límites profesionales apropiados.`,
    temperature: 0.7
  },
  motivador: {
    systemPrompt: `Eres un coach motivacional especializado en bienestar emocional. Tu estilo es entusiasta, alentador y positivo. Utilizas frases inspiradoras, reconoces los logros del usuario y siempre enfocas hacia las fortalezas y posibilidades. Respondes en español de Ecuador con un tono cálido y optimista.`,
    temperature: 0.8
  },
  relajado: {
    systemPrompt: `Eres un compañero de bienestar con un enfoque tranquilo y relajante. Hablas de manera suave, pausada y reconfortante. Usas metáforas relacionadas con la naturaleza, técnicas de mindfulness y generas un ambiente de calma. Respondes en español de Ecuador con un tono sereno y pacífico.`,
    temperature: 0.6
  }
};

// Palabras clave que indican crisis
const crisisKeywords = [
  'suicidio', 'suicidarme', 'matarme', 'quitarme la vida', 'no quiero vivir',
  'quiero morir', 'acabar con todo', 'no vale la pena vivir', 'fin de todo',
  'terminar con mi vida', 'no soporto más', 'mejor estar muerto',
  'desaparecer para siempre', 'no hay salida', 'es demasiado dolor'
];

function detectCrisis(message: string): { isCrisis: boolean; detectedKeywords: string[] } {
  const lowerMessage = message.toLowerCase();
  const detectedKeywords = crisisKeywords.filter(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );
  
  return {
    isCrisis: detectedKeywords.length > 0,
    detectedKeywords
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, tone = 'profesional', sessionId } = await req.json();
    
    if (!message) {
      throw new Error('Mensaje es requerido');
    }

    // Obtener el usuario autenticado
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Token de autorización requerido');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Usuario no autenticado');
    }

    // Detectar crisis antes de procesar
    const crisisDetection = detectCrisis(message);
    
    // Registrar crisis si se detecta
    if (crisisDetection.isCrisis) {
      console.log('🚨 Crisis detectada para usuario:', user.id);
      
      const { error: alertError } = await supabase
        .from('alertas_riesgo')
        .insert({
          user_id: user.id,
          mensaje_detectado: message,
          palabras_clave: crisisDetection.detectedKeywords,
          timestamp: new Date().toISOString()
        });

      if (alertError) {
        console.error('Error registrando alerta de crisis:', alertError);
      }
    }

    // Obtener configuración del tono seleccionado
    const config = toneConfigs[tone as keyof typeof toneConfigs] || toneConfigs.profesional;

    // Obtener historial de conversación reciente (últimos 10 mensajes)
    const { data: chatHistory, error: historyError } = await supabase
      .from('chat_messages')
      .select('message, role')
      .eq('user_id', user.id)
      .eq('session_id', sessionId || 'default')
      .order('timestamp', { ascending: true })
      .limit(10);

    if (historyError) {
      console.error('Error obteniendo historial:', historyError);
    }

    // Construir contexto de conversación
    const messages: ChatMessage[] = [
      { role: 'system', content: config.systemPrompt }
    ];

    // Agregar historial si existe
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach(msg => {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.message
        });
      });
    }

    // Agregar mensaje actual
    messages.push({ role: 'user', content: message });

    // Llamar a OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        temperature: config.temperature,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      throw new Error(`Error de OpenAI: ${errorText}`);
    }

    const aiResult = await openaiResponse.json();
    const assistantMessage = aiResult.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No se recibió respuesta del asistente');
    }

    // Guardar mensaje del usuario
    const { error: userMsgError } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        message: message,
        role: 'user',
        tone: tone,
        session_id: sessionId || 'default',
        timestamp: new Date().toISOString()
      });

    if (userMsgError) {
      console.error('Error guardando mensaje del usuario:', userMsgError);
    }

    // Guardar respuesta del asistente
    const { error: assistantMsgError } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        message: assistantMessage,
        role: 'assistant',
        tone: tone,
        session_id: sessionId || 'default',
        timestamp: new Date().toISOString()
      });

    if (assistantMsgError) {
      console.error('Error guardando mensaje del asistente:', assistantMsgError);
    }

    return new Response(JSON.stringify({
      response: assistantMessage,
      crisisDetected: crisisDetection.isCrisis,
      detectedKeywords: crisisDetection.detectedKeywords,
      tone: tone
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error en ai-chat:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Error interno del servidor' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});