-- Drop existing policy with CASCADE to remove dependencies
DROP POLICY IF EXISTS "Secure support groups access" ON public.support_groups CASCADE;

-- Add missing fields to support_groups table for group creation
ALTER TABLE public.support_groups 
ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS moderator_ids uuid[] DEFAULT ARRAY[]::uuid[],
ADD COLUMN IF NOT EXISTS ubicacion_detalle text,
ADD COLUMN IF NOT EXISTS capacidad_max integer DEFAULT 50,
ADD COLUMN IF NOT EXISTS current_members integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS privacidad text DEFAULT 'publico',
ADD COLUMN IF NOT EXISTS reglas_personalizadas text,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS tematicas text[] DEFAULT ARRAY[]::text[];

-- Add check constraint for privacidad
ALTER TABLE public.support_groups 
ADD CONSTRAINT check_privacidad CHECK (privacidad IN ('publico', 'requiere_aprobacion', 'privado_por_invitacion'));

-- Drop the old condition_type column
ALTER TABLE public.support_groups DROP COLUMN IF EXISTS condition_type;

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
  -- Add owner to moderators array if not already set
  IF NEW.moderator_ids IS NULL OR array_length(NEW.moderator_ids, 1) IS NULL THEN
    NEW.moderator_ids = ARRAY[NEW.owner_id];
  ELSIF NOT (NEW.owner_id = ANY(NEW.moderator_ids)) THEN
    NEW.moderator_ids = NEW.moderator_ids || NEW.owner_id;
  END IF;
  RETURN NEW;
END;
$function$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_group_created ON public.support_groups;

-- Create trigger for new groups
CREATE TRIGGER on_group_created
  BEFORE INSERT ON public.support_groups
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_group();