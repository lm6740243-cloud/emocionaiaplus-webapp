import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sendTwilioSMS(to: string, message: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  // Si no hay configuración de Twilio, simular envío
  if (!accountSid || !authToken || !fromNumber) {
    console.log('🔄 SIMULACIÓN SMS - No hay configuración de Twilio');
    console.log(`Para: ${to}`);
    console.log(`Mensaje: ${message}`);
    
    return {
      success: true,
      sid: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('To', to);
    formData.append('From', fromNumber);
    formData.append('Body', message);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error de Twilio: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      sid: result.sid
    };

  } catch (error) {
    console.error('Error enviando SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, emergencyType = 'crisis', userMessage } = await req.json();
    
    if (!phoneNumber) {
      throw new Error('Número de teléfono es requerido');
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

    // Obtener información del perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, emergency_contact_name, emergency_contact_relation')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error obteniendo perfil:', profileError);
    }

    // Construir mensaje de emergencia
    const userName = profile?.full_name || 'Usuario de EmocionalIA+';
    const contactName = profile?.emergency_contact_name || 'contacto de emergencia';
    const timestamp = new Date().toLocaleString('es-EC', {
      timeZone: 'America/Guayaquil',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let emergencyMessage = '';
    
    if (emergencyType === 'crisis') {
      emergencyMessage = `🚨 ALERTA DE EMERGENCIA - EmocionalIA+

${contactName}, ${userName} ha activado una alerta de crisis emocional.

Hora: ${timestamp}
Ubicación: Ecuador

Por favor, contacta inmediatamente a ${userName} para brindar apoyo.

Recursos de emergencia en Ecuador:
• Teléfono de la Esperanza: 1800-532-835
• MSP Crisis: 171 (opción 6)
• Emergencias: 911

Este mensaje es generado automáticamente por EmocionalIA+ para la protección del usuario.`;
    } else {
      emergencyMessage = `🔔 Alerta EmocionalIA+

${contactName}, ${userName} ha solicitado que te contacten.

Hora: ${timestamp}
${userMessage ? `Mensaje: ${userMessage}` : ''}

Por favor, verifica el estado de ${userName}.

EmocionalIA+ - Cuidando tu bienestar`;
    }

    // Enviar SMS
    const smsResult = await sendTwilioSMS(phoneNumber, emergencyMessage);

    if (!smsResult.success) {
      throw new Error(`No se pudo enviar SMS: ${smsResult.error}`);
    }

    // Si es una crisis, actualizar la alerta correspondiente
    if (emergencyType === 'crisis') {
      const { error: updateError } = await supabase
        .from('alertas_riesgo')
        .update({ 
          contacto_emergencia_notificado: true,
          notas_seguimiento: `SMS enviado a ${phoneNumber}. SID: ${smsResult.sid}`
        })
        .eq('user_id', user.id)
        .eq('atendida', false)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (updateError) {
        console.error('Error actualizando alerta:', updateError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: smsResult.sid?.startsWith('sim_') 
        ? 'SMS simulado enviado exitosamente (configuración de Twilio no disponible)'
        : 'SMS enviado exitosamente',
      sid: smsResult.sid,
      simulated: smsResult.sid?.startsWith('sim_') || false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error en send-emergency-sms:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Error interno del servidor' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});