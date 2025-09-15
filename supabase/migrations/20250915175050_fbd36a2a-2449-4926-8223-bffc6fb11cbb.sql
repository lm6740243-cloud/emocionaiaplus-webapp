-- Crear tabla para mensajes de chat con memoria por usuario
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  tone TEXT CHECK (tone IN ('profesional', 'motivador', 'relajado')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para chat_messages
CREATE POLICY "Users can view their own messages" 
ON public.chat_messages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" 
ON public.chat_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Crear tabla para alertas de riesgo/crisis
CREATE TABLE IF NOT EXISTS public.alertas_riesgo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mensaje_detectado TEXT NOT NULL,
  palabras_clave TEXT[] NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atendida BOOLEAN DEFAULT false,
  contacto_emergencia_notificado BOOLEAN DEFAULT false,
  profesional_notificado BOOLEAN DEFAULT false,
  notas_seguimiento TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en alertas_riesgo
ALTER TABLE public.alertas_riesgo ENABLE ROW LEVEL SECURITY;

-- Políticas para alertas_riesgo
CREATE POLICY "Users can view their own alerts" 
ON public.alertas_riesgo 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create alerts" 
ON public.alertas_riesgo 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Professionals can update alerts" 
ON public.alertas_riesgo 
FOR UPDATE 
USING (true); -- Los profesionales podrán actualizar cualquier alerta

-- Agregar campos de contacto de emergencia a profiles si no existen
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_relation TEXT;

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id_timestamp ON public.chat_messages(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_alertas_riesgo_user_id_timestamp ON public.alertas_riesgo(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alertas_riesgo_atendida ON public.alertas_riesgo(atendida);

-- Trigger para actualizar updated_at en alertas_riesgo
CREATE TRIGGER update_alertas_riesgo_updated_at
  BEFORE UPDATE ON public.alertas_riesgo
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();