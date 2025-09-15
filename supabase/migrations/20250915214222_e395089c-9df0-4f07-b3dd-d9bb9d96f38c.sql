-- Create meetings system for support groups
CREATE TABLE IF NOT EXISTS public.grupo_reuniones (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    grupo_id uuid NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
    titulo text NOT NULL,
    descripcion text,
    fecha_hora timestamp with time zone NOT NULL,
    duracion integer NOT NULL DEFAULT 60, -- minutes
    modalidad text NOT NULL CHECK (modalidad IN ('virtual', 'presencial', 'hibrida')),
    enlace_virtual text,
    ubicacion_presencial text,
    cupo_max integer DEFAULT 50,
    creado_por uuid NOT NULL REFERENCES auth.users(id),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    activo boolean NOT NULL DEFAULT true
);

-- Create meeting attendees table
CREATE TABLE IF NOT EXISTS public.reunion_asistentes (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    reunion_id uuid NOT NULL REFERENCES public.grupo_reuniones(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    fecha_inscripcion timestamp with time zone NOT NULL DEFAULT now(),
    confirmado boolean NOT NULL DEFAULT true,
    recordatorio_enviado_24h boolean NOT NULL DEFAULT false,
    recordatorio_enviado_1h boolean NOT NULL DEFAULT false,
    UNIQUE(reunion_id, user_id)
);

-- Create meeting reminders table for tracking
CREATE TABLE IF NOT EXISTS public.reunion_recordatorios (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    reunion_id uuid NOT NULL REFERENCES public.grupo_reuniones(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo_recordatorio text NOT NULL CHECK (tipo_recordatorio IN ('24h', '1h')),
    enviado_at timestamp with time zone NOT NULL DEFAULT now(),
    canal text NOT NULL CHECK (canal IN ('app', 'email')) DEFAULT 'app'
);

-- Enable RLS
ALTER TABLE public.grupo_reuniones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reunion_asistentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reunion_recordatorios ENABLE ROW LEVEL SECURITY;

-- RLS Policies for grupo_reuniones
CREATE POLICY "Group members can view meetings"
ON public.grupo_reuniones FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM grupo_miembros gm 
        WHERE gm.grupo_id = grupo_reuniones.grupo_id 
        AND gm.user_id = auth.uid() 
        AND gm.activo = true
    )
);

CREATE POLICY "Group moderators can create meetings"
ON public.grupo_reuniones FOR INSERT
WITH CHECK (
    auth.uid() = creado_por AND
    EXISTS (
        SELECT 1 FROM grupo_miembros gm 
        WHERE gm.grupo_id = grupo_reuniones.grupo_id 
        AND gm.user_id = auth.uid() 
        AND gm.rol IN ('moderador', 'propietario')
        AND gm.activo = true
    )
);

CREATE POLICY "Meeting creators can update their meetings"
ON public.grupo_reuniones FOR UPDATE
USING (auth.uid() = creado_por);

CREATE POLICY "Meeting creators can delete their meetings"
ON public.grupo_reuniones FOR DELETE
USING (auth.uid() = creado_por);

-- RLS Policies for reunion_asistentes
CREATE POLICY "Group members can view meeting attendees"
ON public.reunion_asistentes FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM grupo_reuniones gr
        JOIN grupo_miembros gm ON gm.grupo_id = gr.grupo_id
        WHERE gr.id = reunion_asistentes.reunion_id
        AND gm.user_id = auth.uid()
        AND gm.activo = true
    )
);

CREATE POLICY "Users can register for meetings"
ON public.reunion_asistentes FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM grupo_reuniones gr
        JOIN grupo_miembros gm ON gm.grupo_id = gr.grupo_id
        WHERE gr.id = reunion_asistentes.reunion_id
        AND gm.user_id = auth.uid()
        AND gm.activo = true
    )
);

CREATE POLICY "Users can update their own attendance"
ON public.reunion_asistentes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can cancel their attendance"
ON public.reunion_asistentes FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for reunion_recordatorios
CREATE POLICY "Users can view their own reminders"
ON public.reunion_recordatorios FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create reminders"
ON public.reunion_recordatorios FOR INSERT
WITH CHECK (true);

-- Create function to get meeting with attendance count and user status
CREATE OR REPLACE FUNCTION public.get_meeting_with_attendance(p_meeting_id uuid, p_user_id uuid)
RETURNS TABLE (
    id uuid,
    grupo_id uuid,
    titulo text,
    descripcion text,
    fecha_hora timestamp with time zone,
    duracion integer,
    modalidad text,
    enlace_virtual text,
    ubicacion_presencial text,
    cupo_max integer,
    creado_por uuid,
    total_asistentes integer,
    user_registered boolean,
    spaces_available integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        gr.id,
        gr.grupo_id,
        gr.titulo,
        gr.descripcion,
        gr.fecha_hora,
        gr.duracion,
        gr.modalidad,
        gr.enlace_virtual,
        gr.ubicacion_presencial,
        gr.cupo_max,
        gr.creado_por,
        COALESCE(COUNT(ra.id)::integer, 0) as total_asistentes,
        EXISTS(
            SELECT 1 FROM reunion_asistentes ra2 
            WHERE ra2.reunion_id = p_meeting_id 
            AND ra2.user_id = p_user_id
        ) as user_registered,
        GREATEST(0, gr.cupo_max - COALESCE(COUNT(ra.id)::integer, 0)) as spaces_available
    FROM grupo_reuniones gr
    LEFT JOIN reunion_asistentes ra ON ra.reunion_id = gr.id
    WHERE gr.id = p_meeting_id
    GROUP BY gr.id, gr.grupo_id, gr.titulo, gr.descripcion, gr.fecha_hora, 
             gr.duracion, gr.modalidad, gr.enlace_virtual, gr.ubicacion_presencial, 
             gr.cupo_max, gr.creado_por;
END;
$function$;

-- Create function to send meeting reminders
CREATE OR REPLACE FUNCTION public.send_meeting_reminders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
    meeting_record RECORD;
    attendee_record RECORD;
BEGIN
    -- Send 24h reminders
    FOR meeting_record IN 
        SELECT * FROM grupo_reuniones 
        WHERE fecha_hora BETWEEN now() + INTERVAL '23 hours 30 minutes' 
        AND now() + INTERVAL '24 hours 30 minutes'
        AND activo = true
    LOOP
        FOR attendee_record IN
            SELECT ra.*, p.email, p.full_name
            FROM reunion_asistentes ra
            JOIN profiles p ON p.user_id = ra.user_id
            WHERE ra.reunion_id = meeting_record.id 
            AND ra.confirmado = true
            AND ra.recordatorio_enviado_24h = false
        LOOP
            -- Mark as sent
            UPDATE reunion_asistentes 
            SET recordatorio_enviado_24h = true 
            WHERE id = attendee_record.id;
            
            -- Insert reminder record
            INSERT INTO reunion_recordatorios (reunion_id, user_id, tipo_recordatorio, canal)
            VALUES (meeting_record.id, attendee_record.user_id, '24h', 'app');
        END LOOP;
    END LOOP;
    
    -- Send 1h reminders
    FOR meeting_record IN 
        SELECT * FROM grupo_reuniones 
        WHERE fecha_hora BETWEEN now() + INTERVAL '30 minutes' 
        AND now() + INTERVAL '1 hour 30 minutes'
        AND activo = true
    LOOP
        FOR attendee_record IN
            SELECT ra.*, p.email, p.full_name
            FROM reunion_asistentes ra
            JOIN profiles p ON p.user_id = ra.user_id
            WHERE ra.reunion_id = meeting_record.id 
            AND ra.confirmado = true
            AND ra.recordatorio_enviado_1h = false
        LOOP
            -- Mark as sent
            UPDATE reunion_asistentes 
            SET recordatorio_enviado_1h = true 
            WHERE id = attendee_record.id;
            
            -- Insert reminder record
            INSERT INTO reunion_recordatorios (reunion_id, user_id, tipo_recordatorio, canal)
            VALUES (meeting_record.id, attendee_record.user_id, '1h', 'app');
        END LOOP;
    END LOOP;
END;
$function$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_grupo_reuniones_grupo_id ON public.grupo_reuniones(grupo_id);
CREATE INDEX IF NOT EXISTS idx_grupo_reuniones_fecha_hora ON public.grupo_reuniones(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_reunion_asistentes_reunion_user ON public.reunion_asistentes(reunion_id, user_id);
CREATE INDEX IF NOT EXISTS idx_reunion_recordatorios_user_fecha ON public.reunion_recordatorios(user_id, enviado_at);

-- Enable realtime for meetings
ALTER TABLE public.grupo_reuniones REPLICA IDENTITY FULL;
ALTER TABLE public.reunion_asistentes REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.grupo_reuniones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reunion_asistentes;