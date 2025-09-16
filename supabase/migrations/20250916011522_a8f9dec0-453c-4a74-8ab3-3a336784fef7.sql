-- Update support_groups table to match grupos specification
ALTER TABLE support_groups 
ADD COLUMN IF NOT EXISTS reglas_personalizadas text,
ADD COLUMN IF NOT EXISTS creado_en timestamptz DEFAULT now();

-- Ensure grupo_miembros has all required columns
ALTER TABLE grupo_miembros 
ADD COLUMN IF NOT EXISTS estado text DEFAULT 'activo',
ADD COLUMN IF NOT EXISTS acepta_codigo_conducta boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS creado_en timestamptz DEFAULT now();

-- Update grupo_mensajes to match specification
ALTER TABLE grupo_mensajes 
ADD COLUMN IF NOT EXISTS adjunto_url text,
ADD COLUMN IF NOT EXISTS es_fijado boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS es_flaggeado boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS crisis_nivel text,
ADD COLUMN IF NOT EXISTS creado_en timestamptz DEFAULT now();

-- Update grupo_reportes to match specification
ALTER TABLE grupo_reportes 
ADD COLUMN IF NOT EXISTS estado text DEFAULT 'pendiente',
ADD COLUMN IF NOT EXISTS creado_en timestamptz DEFAULT now();

-- Create grupo_eventos table (updating from grupo_reuniones)
CREATE TABLE IF NOT EXISTS grupo_eventos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    grupo_id uuid NOT NULL REFERENCES support_groups(id) ON DELETE CASCADE,
    titulo text NOT NULL,
    descripcion text,
    fecha_hora timestamptz NOT NULL,
    duracion_min integer DEFAULT 60,
    modalidad text NOT NULL CHECK (modalidad IN ('virtual', 'presencial', 'hibrido')),
    enlace_virtual text,
    ubicacion_presencial text,
    cupo_max integer DEFAULT 50,
    creado_por uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create grupo_eventos_asistentes table
CREATE TABLE IF NOT EXISTS grupo_eventos_asistentes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id uuid NOT NULL REFERENCES grupo_eventos(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    confirmado boolean DEFAULT true,
    creado_en timestamptz NOT NULL DEFAULT now(),
    UNIQUE(evento_id, user_id)
);

-- Enable RLS on new tables
ALTER TABLE grupo_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupo_eventos_asistentes ENABLE ROW LEVEL SECURITY;

-- RLS policies for grupo_eventos
CREATE POLICY "Group members can view events" ON grupo_eventos
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM grupo_miembros gm 
        WHERE gm.grupo_id = grupo_eventos.grupo_id 
        AND gm.user_id = auth.uid() 
        AND gm.activo = true
    )
);

CREATE POLICY "Group moderators can create events" ON grupo_eventos
FOR INSERT WITH CHECK (
    auth.uid() = creado_por AND
    EXISTS (
        SELECT 1 FROM grupo_miembros gm 
        WHERE gm.grupo_id = grupo_eventos.grupo_id 
        AND gm.user_id = auth.uid() 
        AND gm.rol IN ('moderador', 'propietario')
        AND gm.activo = true
    )
);

CREATE POLICY "Event creators can update their events" ON grupo_eventos
FOR UPDATE USING (auth.uid() = creado_por);

CREATE POLICY "Event creators can delete their events" ON grupo_eventos
FOR DELETE USING (auth.uid() = creado_por);

-- RLS policies for grupo_eventos_asistentes
CREATE POLICY "Group members can view event attendees" ON grupo_eventos_asistentes
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM grupo_eventos ge 
        JOIN grupo_miembros gm ON gm.grupo_id = ge.grupo_id
        WHERE ge.id = grupo_eventos_asistentes.evento_id 
        AND gm.user_id = auth.uid() 
        AND gm.activo = true
    )
);

CREATE POLICY "Users can register for events" ON grupo_eventos_asistentes
FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM grupo_eventos ge 
        JOIN grupo_miembros gm ON gm.grupo_id = ge.grupo_id
        WHERE ge.id = grupo_eventos_asistentes.evento_id 
        AND gm.user_id = auth.uid() 
        AND gm.activo = true
    )
);

CREATE POLICY "Users can update their own attendance" ON grupo_eventos_asistentes
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can cancel their attendance" ON grupo_eventos_asistentes
FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers where missing
DROP TRIGGER IF EXISTS update_grupo_eventos_updated_at ON grupo_eventos;
CREATE TRIGGER update_grupo_eventos_updated_at
    BEFORE UPDATE ON grupo_eventos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Supabase Realtime on grupo_mensajes and grupo_miembros
ALTER TABLE grupo_mensajes REPLICA IDENTITY FULL;
ALTER TABLE grupo_miembros REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE grupo_mensajes;
ALTER PUBLICATION supabase_realtime ADD TABLE grupo_miembros;