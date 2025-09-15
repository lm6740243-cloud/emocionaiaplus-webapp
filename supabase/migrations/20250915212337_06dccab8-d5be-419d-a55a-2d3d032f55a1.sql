-- Create group members table for managing membership and aliases
CREATE TABLE public.grupo_miembros (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    grupo_id uuid NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    alias text NOT NULL,
    rol text NOT NULL DEFAULT 'miembro' CHECK (rol IN ('miembro', 'moderador', 'propietario')),
    fecha_union timestamp with time zone NOT NULL DEFAULT now(),
    activo boolean NOT NULL DEFAULT true,
    UNIQUE(grupo_id, user_id),
    UNIQUE(grupo_id, alias)
);

-- Create group messages table for chat functionality
CREATE TABLE public.grupo_mensajes (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    grupo_id uuid NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
    autor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contenido text NOT NULL,
    tipo_mensaje text NOT NULL DEFAULT 'texto' CHECK (tipo_mensaje IN ('texto', 'imagen', 'audio', 'archivo')),
    archivo_url text,
    respondiendo_a uuid REFERENCES public.grupo_mensajes(id) ON DELETE SET NULL,
    fijado boolean NOT NULL DEFAULT false,
    reportado boolean NOT NULL DEFAULT false,
    editado boolean NOT NULL DEFAULT false,
    fecha_creacion timestamp with time zone NOT NULL DEFAULT now(),
    fecha_edicion timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Create table for tracking online presence
CREATE TABLE public.grupo_presencia (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    grupo_id uuid NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ultima_actividad timestamp with time zone NOT NULL DEFAULT now(),
    en_linea boolean NOT NULL DEFAULT true,
    UNIQUE(grupo_id, user_id)
);

-- Create table for message reports
CREATE TABLE public.grupo_reportes (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    mensaje_id uuid NOT NULL REFERENCES public.grupo_mensajes(id) ON DELETE CASCADE,
    reportado_por uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    motivo text NOT NULL,
    descripcion text,
    resuelto boolean NOT NULL DEFAULT false,
    fecha_reporte timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(mensaje_id, reportado_por)
);

-- Add settings for slow mode to support_groups table
ALTER TABLE public.support_groups 
ADD COLUMN IF NOT EXISTS modo_lento_segundos integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS configuracion_chat jsonb DEFAULT '{
  "permitir_adjuntos": true,
  "permitir_emojis": true,
  "maximo_caracteres": 2000,
  "filtro_palabras": false
}'::jsonb;

-- Enable RLS on all tables
ALTER TABLE public.grupo_miembros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupo_mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupo_presencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupo_reportes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for grupo_miembros
CREATE POLICY "Members can view group membership" 
ON public.grupo_miembros FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.grupo_miembros gm2 
        WHERE gm2.grupo_id = grupo_miembros.grupo_id 
        AND gm2.user_id = auth.uid() 
        AND gm2.activo = true
    )
);

CREATE POLICY "Users can join groups" 
ON public.grupo_miembros FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can update their own info" 
ON public.grupo_miembros FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for grupo_mensajes
CREATE POLICY "Group members can view messages" 
ON public.grupo_mensajes FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.grupo_miembros gm 
        WHERE gm.grupo_id = grupo_mensajes.grupo_id 
        AND gm.user_id = auth.uid() 
        AND gm.activo = true
    )
);

CREATE POLICY "Group members can send messages" 
ON public.grupo_mensajes FOR INSERT 
WITH CHECK (
    auth.uid() = autor_id 
    AND EXISTS (
        SELECT 1 FROM public.grupo_miembros gm 
        WHERE gm.grupo_id = grupo_mensajes.grupo_id 
        AND gm.user_id = auth.uid() 
        AND gm.activo = true
    )
);

CREATE POLICY "Authors can update their messages" 
ON public.grupo_mensajes FOR UPDATE 
USING (
    auth.uid() = autor_id 
    OR EXISTS (
        SELECT 1 FROM public.grupo_miembros gm 
        WHERE gm.grupo_id = grupo_mensajes.grupo_id 
        AND gm.user_id = auth.uid() 
        AND gm.rol IN ('moderador', 'propietario')
    )
);

-- RLS Policies for grupo_presencia
CREATE POLICY "Group members can view presence" 
ON public.grupo_presencia FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.grupo_miembros gm 
        WHERE gm.grupo_id = grupo_presencia.grupo_id 
        AND gm.user_id = auth.uid() 
        AND gm.activo = true
    )
);

CREATE POLICY "Users can update their presence" 
ON public.grupo_presencia FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for grupo_reportes
CREATE POLICY "Users can report messages" 
ON public.grupo_reportes FOR INSERT 
WITH CHECK (auth.uid() = reportado_por);

CREATE POLICY "Moderators can view reports" 
ON public.grupo_reportes FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.grupo_mensajes gm 
        JOIN public.grupo_miembros gmb ON gmb.grupo_id = gm.grupo_id
        WHERE gm.id = grupo_reportes.mensaje_id 
        AND gmb.user_id = auth.uid() 
        AND gmb.rol IN ('moderador', 'propietario')
    )
);

-- Create indexes for better performance
CREATE INDEX idx_grupo_miembros_grupo_id ON public.grupo_miembros(grupo_id);
CREATE INDEX idx_grupo_miembros_user_id ON public.grupo_miembros(user_id);
CREATE INDEX idx_grupo_mensajes_grupo_id ON public.grupo_mensajes(grupo_id);
CREATE INDEX idx_grupo_mensajes_fecha ON public.grupo_mensajes(fecha_creacion DESC);
CREATE INDEX idx_grupo_presencia_grupo_id ON public.grupo_presencia(grupo_id);

-- Enable realtime for the messages table
ALTER TABLE public.grupo_mensajes REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.grupo_mensajes;

-- Enable realtime for presence table
ALTER TABLE public.grupo_presencia REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.grupo_presencia;

-- Create function to automatically add owner as member when creating group
CREATE OR REPLACE FUNCTION public.add_group_owner_as_member()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Add owner as member with 'propietario' role
  INSERT INTO public.grupo_miembros (grupo_id, user_id, alias, rol)
  VALUES (NEW.id, NEW.owner_id, 'Propietario', 'propietario');
  RETURN NEW;
END;
$function$;

-- Create trigger to add owner as member
CREATE TRIGGER trigger_add_group_owner_as_member
  AFTER INSERT ON public.support_groups
  FOR EACH ROW EXECUTE FUNCTION public.add_group_owner_as_member();

-- Function to update presence
CREATE OR REPLACE FUNCTION public.update_user_presence(
  p_grupo_id uuid,
  p_en_linea boolean DEFAULT true
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.grupo_presencia (grupo_id, user_id, en_linea, ultima_actividad)
  VALUES (p_grupo_id, auth.uid(), p_en_linea, now())
  ON CONFLICT (grupo_id, user_id)
  DO UPDATE SET 
    en_linea = p_en_linea,
    ultima_actividad = now();
END;
$function$;