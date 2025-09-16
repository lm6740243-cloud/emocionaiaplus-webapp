import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationRequest {
  user_ids: string[];
  tipo: string;
  titulo: string;
  mensaje: string;
  grupo_id?: string;
  metadata?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_ids, tipo, titulo, mensaje, grupo_id, metadata }: NotificationRequest = await req.json();

    console.log('Sending notifications:', { user_ids, tipo, titulo, mensaje, grupo_id });

    // Check notification preferences for each user
    const notifications = [];
    
    for (const user_id of user_ids) {
      // Check if user has preferences for this notification type
      const { data: preferences } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user_id)
        .eq('tipo_notificacion', tipo)
        .or(`grupo_id.eq.${grupo_id},grupo_id.is.null`)
        .order('grupo_id', { ascending: false }); // Group-specific preferences take priority

      let shouldSendInApp = true;
      let shouldSendEmail = false;

      if (preferences && preferences.length > 0) {
        // Use the first preference (group-specific if available, otherwise global)
        const pref = preferences[0];
        shouldSendInApp = pref.in_app_enabled;
        shouldSendEmail = pref.email_enabled;
      }

      // Create in-app notification if enabled
      if (shouldSendInApp) {
        notifications.push({
          user_id,
          grupo_id,
          tipo,
          titulo,
          mensaje,
          metadata,
          leida: false
        });
      }

      // Send email notification if enabled
      if (shouldSendEmail) {
        // Get user profile for email
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('user_id', user_id)
          .single();

        if (profile?.email) {
          console.log(`Would send email to ${profile.email} for notification: ${titulo}`);
          // Here you would integrate with your email service (Resend, etc.)
          // For now, we'll just log it
        }
      }
    }

    // Insert in-app notifications
    if (notifications.length > 0) {
      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (insertError) {
        throw insertError;
      }
    }

    console.log(`Successfully sent ${notifications.length} notifications`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent_count: notifications.length,
        message: 'Notifications sent successfully' 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error sending notifications:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      }
    );
  }
});