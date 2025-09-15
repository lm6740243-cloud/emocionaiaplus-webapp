-- Add missing fields to support_groups table for group creation
ALTER TABLE public.support_groups 
ADD COLUMN owner_id uuid REFERENCES auth.users(id),
ADD COLUMN moderator_ids uuid[] DEFAULT ARRAY[]::uuid[],
ADD COLUMN ubicacion_detalle text,
ADD COLUMN capacidad_max integer DEFAULT 50,
ADD COLUMN current_members integer DEFAULT 0,
ADD COLUMN privacidad text DEFAULT 'publico' CHECK (privacidad IN ('publico', 'requiere_aprobacion', 'privado_por_invitacion')),
ADD COLUMN reglas_personalizadas text,
ADD COLUMN is_active boolean DEFAULT true;

-- Update condition_type to support multiple topics
ALTER TABLE public.support_groups 
DROP COLUMN condition_type,
ADD COLUMN tematicas text[] DEFAULT ARRAY[]::text[];

-- Update RLS policies to allow users to create groups
DROP POLICY IF EXISTS "Secure support groups access" ON public.support_groups;

-- New RLS policies for group management
CREATE POLICY "Users can view active public groups" 
ON public.support_groups 
FOR SELECT 
USING (is_active = true AND (
  privacidad = 'publico' OR 
  (privacidad = 'requiere_aprobacion') OR
  (auth.uid() = owner_id) OR
  (auth.uid() = ANY(moderator_ids))
));

CREATE POLICY "Users can create groups" 
ON public.support_groups 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their groups" 
ON public.support_groups 
FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their groups" 
ON public.support_groups 
FOR DELETE 
USING (auth.uid() = owner_id);

-- Create a function to automatically set the creator as owner and moderator
CREATE OR REPLACE FUNCTION public.handle_new_group()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Set current_members to 1 (the creator)
  NEW.current_members = 1;
  -- Add owner to moderators array
  NEW.moderator_ids = ARRAY[NEW.owner_id];
  RETURN NEW;
END;
$function$;

-- Create trigger for new groups
CREATE TRIGGER on_group_created
  BEFORE INSERT ON public.support_groups
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_group();