-- Update alertas_riesgo table to support group sources
ALTER TABLE public.alertas_riesgo 
ADD COLUMN IF NOT EXISTS fuente text NOT NULL DEFAULT 'chat',
ADD COLUMN IF NOT EXISTS grupo_id uuid REFERENCES public.support_groups(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS mensaje_id uuid REFERENCES public.grupo_mensajes(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS nivel_severidad text NOT NULL DEFAULT 'medio' CHECK (nivel_severidad IN ('bajo', 'medio', 'alto', 'critico'));

-- Add moderation fields to grupo_miembros
ALTER TABLE public.grupo_miembros
ADD COLUMN IF NOT EXISTS silenciado_hasta timestamp with time zone,
ADD COLUMN IF NOT EXISTS baneado boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS fecha_ban timestamp with time zone,
ADD COLUMN IF NOT EXISTS razon_ban text,
ADD COLUMN IF NOT EXISTS moderado_por uuid REFERENCES auth.users(id);

-- Create table for private chats between moderators and members
CREATE TABLE IF NOT EXISTS public.moderador_chat_privado (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    grupo_id uuid NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
    moderador_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    miembro_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mensaje text NOT NULL,
    enviado_por uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    leido boolean NOT NULL DEFAULT false,
    fecha_envio timestamp with time zone NOT NULL DEFAULT now(),
    tipo_mensaje text NOT NULL DEFAULT 'texto',
    UNIQUE(grupo_id, moderador_id, miembro_id)
);

-- Create crisis keywords table for auto-moderation
CREATE TABLE IF NOT EXISTS public.crisis_keywords (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    palabra text NOT NULL UNIQUE,
    categoria text NOT NULL CHECK (categoria IN ('crisis', 'insulto', 'spam', 'drogas')),
    severidad text NOT NULL DEFAULT 'medio' CHECK (severidad IN ('bajo', 'medio', 'alto', 'critico')),
    activo boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for emergency contacts (Ecuador specific)
CREATE TABLE IF NOT EXISTS public.recursos_emergencia (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    pais text NOT NULL DEFAULT 'Ecuador',
    tipo text NOT NULL CHECK (tipo IN ('linea_crisis', 'hospital', 'policia', 'organizacion')),
    nombre text NOT NULL,
    telefono text NOT NULL,
    descripcion text,
    disponibilidad text NOT NULL DEFAULT '24/7',
    activo boolean NOT NULL DEFAULT true,
    orden integer DEFAULT 0
);

-- Enable RLS on new tables
ALTER TABLE public.moderador_chat_privado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recursos_emergencia ENABLE ROW LEVEL SECURITY;

-- RLS Policies for moderador_chat_privado
CREATE POLICY "Moderators and members can view their private chats"
ON public.moderador_chat_privado FOR SELECT
USING (
    auth.uid() = moderador_id OR auth.uid() = miembro_id
);

CREATE POLICY "Moderators and members can send private messages"
ON public.moderador_chat_privado FOR INSERT
WITH CHECK (
    auth.uid() = enviado_por AND 
    (auth.uid() = moderador_id OR auth.uid() = miembro_id)
);

CREATE POLICY "Users can update read status of their messages"
ON public.moderador_chat_privado FOR UPDATE
USING (
    auth.uid() = moderador_id OR auth.uid() = miembro_id
);

-- RLS Policies for crisis_keywords (read-only for all users)
CREATE POLICY "All users can view crisis keywords"
ON public.crisis_keywords FOR SELECT
USING (activo = true);

-- RLS Policies for recursos_emergencia (public read access)
CREATE POLICY "All users can view emergency resources"
ON public.recursos_emergencia FOR SELECT
USING (activo = true);

-- Insert Ecuador emergency resources
INSERT INTO public.recursos_emergencia (tipo, nombre, telefono, descripcion, orden) VALUES
('linea_crisis', 'Línea de Crisis Nacional', '171', 'Línea nacional de prevención del suicidio - Ecuador', 1),
('linea_crisis', 'Fundación Desarrollo Humano Integral', '1800-335464', 'Apoyo psicológico gratuito 24 horas', 2),
('policia', 'ECU 911', '911', 'Emergencias policiales, médicas y bomberos', 3),
('hospital', 'Hospital Psiquiátrico Julio Endara', '02-267-6000', 'Hospital de salud mental de referencia en Quito', 4),
('organizacion', 'Fundación Esquel', '02-333-2172', 'Organización de apoyo psicosocial y salud mental', 5),
('linea_crisis', 'Cruz Roja Ecuatoriana', '131', 'Primeros auxilios psicológicos y apoyo emocional', 6);

-- Insert crisis detection keywords
INSERT INTO public.crisis_keywords (palabra, categoria, severidad) VALUES
-- Crisis keywords (high severity)
('suicidio', 'crisis', 'critico'),
('suicidarme', 'crisis', 'critico'),
('matarme', 'crisis', 'critico'),
('quitarme la vida', 'crisis', 'critico'),
('no quiero vivir', 'crisis', 'alto'),
('quiero morir', 'crisis', 'critico'),
('acabar con todo', 'crisis', 'alto'),
('lastimarse', 'crisis', 'alto'),
('cortarme', 'crisis', 'alto'),
('autolesión', 'crisis', 'alto'),
('overdose', 'crisis', 'critico'),
('sobredosis', 'crisis', 'critico'),
-- Insult keywords (medium severity)
('idiota', 'insulto', 'medio'),
('estúpido', 'insulto', 'medio'),
('imbécil', 'insulto', 'medio'),
('pendejo', 'insulto', 'medio'),
('cabrón', 'insulto', 'medio'),
('hijo de puta', 'insulto', 'alto'),
('marica', 'insulto', 'alto'),
('gay de mierda', 'insulto', 'alto'),
-- Drug-related keywords
('cocaína', 'drogas', 'medio'),
('marihuana', 'drogas', 'bajo'),
('heroína', 'drogas', 'alto'),
('drogas duras', 'drogas', 'alto');

-- Create function to detect crisis in messages
CREATE OR REPLACE FUNCTION public.detect_crisis_in_message(
    mensaje_contenido text,
    p_grupo_id uuid,
    p_mensaje_id uuid,
    p_user_id uuid
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
    keyword_record RECORD;
    palabras_detectadas text[] := '{}';
    max_severidad text := 'bajo';
    tiene_crisis boolean := false;
BEGIN
    -- Check for crisis keywords in the message
    FOR keyword_record IN 
        SELECT palabra, categoria, severidad 
        FROM crisis_keywords 
        WHERE activo = true 
        AND lower(mensaje_contenido) LIKE '%' || lower(palabra) || '%'
    LOOP
        palabras_detectadas := palabras_detectadas || keyword_record.palabra;
        
        -- Update max severity level
        IF keyword_record.severidad = 'critico' THEN
            max_severidad := 'critico';
        ELSIF keyword_record.severidad = 'alto' AND max_severidad != 'critico' THEN
            max_severidad := 'alto';
        ELSIF keyword_record.severidad = 'medio' AND max_severidad NOT IN ('critico', 'alto') THEN
            max_severidad := 'medio';
        END IF;
        
        -- Mark as crisis if it's crisis category and high severity
        IF keyword_record.categoria = 'crisis' AND keyword_record.severidad IN ('alto', 'critico') THEN
            tiene_crisis := true;
        END IF;
    END LOOP;
    
    -- If keywords were detected, create alert
    IF array_length(palabras_detectadas, 1) > 0 THEN
        INSERT INTO alertas_riesgo (
            user_id,
            fuente,
            grupo_id,
            mensaje_id,
            nivel_severidad,
            mensaje_detectado,
            palabras_clave,
            timestamp
        ) VALUES (
            p_user_id,
            'grupo',
            p_grupo_id,
            p_mensaje_id,
            max_severidad,
            mensaje_contenido,
            palabras_detectadas,
            now()
        );
    END IF;
    
    RETURN tiene_crisis;
END;
$function$;

-- Create function for moderator actions
CREATE OR REPLACE FUNCTION public.moderate_member(
    p_grupo_id uuid,
    p_target_user_id uuid,
    p_action text, -- 'silence', 'kick', 'ban'
    p_duration_hours integer DEFAULT NULL,
    p_reason text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
    is_moderator boolean := false;
BEGIN
    -- Check if current user is moderator or owner
    SELECT EXISTS(
        SELECT 1 FROM grupo_miembros 
        WHERE grupo_id = p_grupo_id 
        AND user_id = auth.uid() 
        AND rol IN ('moderador', 'propietario')
        AND activo = true
    ) INTO is_moderator;
    
    IF NOT is_moderator THEN
        RAISE EXCEPTION 'No tienes permisos de moderación';
    END IF;
    
    -- Apply moderation action
    IF p_action = 'silence' THEN
        UPDATE grupo_miembros 
        SET silenciado_hasta = now() + (p_duration_hours || ' hours')::interval,
            moderado_por = auth.uid()
        WHERE grupo_id = p_grupo_id AND user_id = p_target_user_id;
        
    ELSIF p_action = 'kick' THEN
        UPDATE grupo_miembros 
        SET activo = false,
            moderado_por = auth.uid()
        WHERE grupo_id = p_grupo_id AND user_id = p_target_user_id;
        
    ELSIF p_action = 'ban' THEN
        UPDATE grupo_miembros 
        SET activo = false,
            baneado = true,
            fecha_ban = now(),
            razon_ban = p_reason,
            moderado_por = auth.uid()
        WHERE grupo_id = p_grupo_id AND user_id = p_target_user_id;
    END IF;
    
    RETURN true;
END;
$function$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_alertas_riesgo_grupo_id ON public.alertas_riesgo(grupo_id);
CREATE INDEX IF NOT EXISTS idx_alertas_riesgo_fuente ON public.alertas_riesgo(fuente);
CREATE INDEX IF NOT EXISTS idx_crisis_keywords_palabra ON public.crisis_keywords(lower(palabra));
CREATE INDEX IF NOT EXISTS idx_moderador_chat_privado_grupo ON public.moderador_chat_privado(grupo_id);

-- Enable realtime for private chat
ALTER TABLE public.moderador_chat_privado REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.moderador_chat_privado;