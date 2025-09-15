-- Add city and province fields to profiles if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS province text;

-- Create local resources table
CREATE TABLE IF NOT EXISTS public.recursos_locales (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre text NOT NULL,
    tipo text NOT NULL CHECK (tipo IN ('linea_ayuda', 'organizacion', 'hospital', 'centro_salud', 'ong')),
    telefono text,
    email text,
    sitio_web text,
    direccion text,
    descripcion text,
    ciudad text NOT NULL,
    provincia text NOT NULL,
    horarios text,
    servicios text[], -- Array of services offered
    poblacion_objetivo text[], -- Target population (adolescentes, adultos, familias, etc.)
    costo text DEFAULT 'gratuito',
    activo boolean NOT NULL DEFAULT true,
    verificado boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for recursos_locales
ALTER TABLE public.recursos_locales ENABLE ROW LEVEL SECURITY;

-- RLS Policy for recursos_locales (public read access for active and verified resources)
CREATE POLICY "All users can view active local resources"
ON public.recursos_locales FOR SELECT
USING (activo = true AND verificado = true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_recursos_locales_ubicacion ON public.recursos_locales(ciudad, provincia);
CREATE INDEX IF NOT EXISTS idx_recursos_locales_tipo ON public.recursos_locales(tipo);
CREATE INDEX IF NOT EXISTS idx_profiles_ubicacion ON public.profiles(city, province);

-- Insert sample local resources for Ecuador
INSERT INTO public.recursos_locales (nombre, tipo, telefono, email, sitio_web, descripcion, ciudad, provincia, horarios, servicios, poblacion_objetivo, verificado) VALUES
-- Quito resources
('Fundación Desarrollo Humano Integral', 'organizacion', '1800-335464', 'info@fudhi.org', 'https://fudhi.org', 'Apoyo psicológico gratuito y programas de salud mental', 'Quito', 'Pichincha', '24 horas', ARRAY['terapia_psicologica', 'apoyo_crisis', 'programas_grupales'], ARRAY['adolescentes', 'adultos', 'familias'], true),

('Hospital Psiquiátrico Julio Endara', 'hospital', '02-267-6000', 'contacto@hjendara.gob.ec', 'https://hjendara.gob.ec', 'Hospital de referencia en salud mental', 'Quito', 'Pichincha', 'Lunes a Viernes 08:00-16:00', ARRAY['internacion', 'consulta_externa', 'emergencias'], ARRAY['adolescentes', 'adultos'], true),

('Centro de Salud Mental Comunitario Norte', 'centro_salud', '02-234-5678', 'csmcnorte@msp.gob.ec', null, 'Atención primaria en salud mental', 'Quito', 'Pichincha', 'Lunes a Viernes 07:00-15:00', ARRAY['consulta_psicologica', 'consulta_psiquiatrica', 'grupos_apoyo'], ARRAY['adolescentes', 'adultos', 'adultos_mayores'], true),

-- Guayaquil resources
('Fundación Semillas de Amor', 'ong', '04-456-7890', 'info@semillasdeamor.org', 'https://semillasdeamor.org', 'Apoyo psicosocial y programas comunitarios', 'Guayaquil', 'Guayas', 'Lunes a Viernes 08:00-17:00', ARRAY['terapia_familiar', 'apoyo_grupal', 'talleres'], ARRAY['adolescentes', 'familias', 'mujeres'], true),

('Hospital de Niños Dr. Roberto Gilbert', 'hospital', '04-371-8500', 'contacto@hospitalrobertgilbert.med.ec', 'https://hospitalrobertgilbert.med.ec', 'Atención especializada en salud mental infantil y adolescente', 'Guayaquil', 'Guayas', '24 horas para emergencias', ARRAY['psiquiatria_infantil', 'psicologia_clinica', 'emergencias'], ARRAY['niños', 'adolescentes'], true),

-- Cuenca resources
('Centro de Salud Mental Cuenca', 'centro_salud', '07-283-9000', 'csm.cuenca@msp.gob.ec', null, 'Centro especializado en salud mental', 'Cuenca', 'Azuay', 'Lunes a Viernes 07:00-15:00', ARRAY['consulta_psicologica', 'consulta_psiquiatrica', 'terapia_grupal'], ARRAY['adolescentes', 'adultos'], true),

('Fundación Donum', 'ong', '07-405-1234', 'info@donum.org.ec', 'https://donum.org.ec', 'Programas de prevención del suicidio y apoyo emocional', 'Cuenca', 'Azuay', 'Lunes a Viernes 08:00-16:00', ARRAY['prevencion_suicidio', 'apoyo_emocional', 'talleres_preventivos'], ARRAY['adolescentes', 'adultos', 'familias'], true),

-- National helplines (available from any city)
('Línea de Crisis Nacional', 'linea_ayuda', '171', null, null, 'Línea nacional de prevención del suicidio', 'Nacional', 'Nacional', '24 horas', ARRAY['crisis_suicida', 'apoyo_emocional', 'orientacion'], ARRAY['todas'], true),

('ECU 911 - Emergencias', 'linea_ayuda', '911', null, 'https://ecu911.gob.ec', 'Emergencias médicas, policiales y de salud mental', 'Nacional', 'Nacional', '24 horas', ARRAY['emergencias', 'crisis', 'primeros_auxilios'], ARRAY['todas'], true),

('Cruz Roja Ecuatoriana', 'linea_ayuda', '131', 'info@cruzroja.org.ec', 'https://cruzroja.org.ec', 'Primeros auxilios psicológicos y apoyo emocional', 'Nacional', 'Nacional', '24 horas', ARRAY['primeros_auxilios_psicologicos', 'apoyo_emocional'], ARRAY['todas'], true);

-- Create function to get nearby groups based on user location
CREATE OR REPLACE FUNCTION public.get_nearby_groups(p_user_city text, p_user_province text)
RETURNS TABLE (
    id uuid,
    name text,
    description text,
    city text,
    country text,
    region text,
    meeting_type text,
    current_members integer,
    capacidad_max integer,
    created_at timestamp with time zone,
    is_local boolean,
    distance_score integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        sg.id,
        sg.name,
        sg.description,
        sg.city,
        sg.country,
        sg.region,
        sg.meeting_type,
        sg.current_members,
        sg.capacidad_max,
        sg.created_at,
        CASE 
            WHEN sg.city = p_user_city AND sg.region = p_user_province THEN true
            ELSE false
        END as is_local,
        CASE 
            WHEN sg.city = p_user_city AND sg.region = p_user_province THEN 1  -- Same city
            WHEN sg.region = p_user_province THEN 2                           -- Same province
            WHEN sg.country = 'Ecuador' THEN 3                               -- Same country
            ELSE 4                                                            -- Other countries
        END as distance_score
    FROM support_groups sg
    WHERE sg.is_active = true
    AND (sg.privacidad = 'publico' OR sg.privacidad = 'requiere_aprobacion')
    ORDER BY distance_score ASC, sg.created_at DESC;
END;
$function$;

-- Create function to get local resources based on user location
CREATE OR REPLACE FUNCTION public.get_local_resources(p_user_city text, p_user_province text)
RETURNS TABLE (
    id uuid,
    nombre text,
    tipo text,
    telefono text,
    email text,
    sitio_web text,
    direccion text,
    descripcion text,
    horarios text,
    servicios text[],
    poblacion_objetivo text[],
    costo text,
    is_local boolean,
    distance_score integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        rl.id,
        rl.nombre,
        rl.tipo,
        rl.telefono,
        rl.email,
        rl.sitio_web,
        rl.direccion,
        rl.descripcion,
        rl.horarios,
        rl.servicios,
        rl.poblacion_objetivo,
        rl.costo,
        CASE 
            WHEN rl.ciudad = p_user_city AND rl.provincia = p_user_province THEN true
            WHEN rl.ciudad = 'Nacional' THEN true  -- National resources are always local
            ELSE false
        END as is_local,
        CASE 
            WHEN rl.ciudad = p_user_city AND rl.provincia = p_user_province THEN 1  -- Same city
            WHEN rl.ciudad = 'Nacional' THEN 2                                      -- National resources
            WHEN rl.provincia = p_user_province THEN 3                              -- Same province
            ELSE 4                                                                  -- Other provinces
        END as distance_score
    FROM recursos_locales rl
    WHERE rl.activo = true AND rl.verificado = true
    ORDER BY distance_score ASC, rl.tipo ASC, rl.nombre ASC;
END;
$function$;