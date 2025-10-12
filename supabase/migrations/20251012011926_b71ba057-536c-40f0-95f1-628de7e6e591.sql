-- MIGRATION: Production Security & Performance

-- ============================================
-- PART 1: USER ROLES SYSTEM
-- ============================================

DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'psychologist', 'patient', 'support');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  granted_at timestamp with time zone NOT NULL DEFAULT now(),
  granted_by uuid REFERENCES auth.users(id),
  expires_at timestamp with time zone,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function
CREATE OR REPLACE FUNCTION public.has_role(p_user_id uuid, p_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = p_user_id AND role = p_role
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
  );
$$;

-- RLS
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
CREATE POLICY "Users can view their own roles"
ON user_roles FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
CREATE POLICY "Admins can manage roles"
ON user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- PART 2: SECURITY FIXES
-- ============================================

DROP POLICY IF EXISTS "Psychologists can view their patients" ON patients;
DROP POLICY IF EXISTS "Patients can view their own data" ON patients;
DROP POLICY IF EXISTS "Patients view own data" ON patients;
DROP POLICY IF EXISTS "Assigned psychologist only" ON patients;

CREATE POLICY "Patients view own data"
ON patients FOR SELECT
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = patients.profile_id AND profiles.user_id = auth.uid())
);

CREATE POLICY "Assigned psychologist only"
ON patients FOR SELECT
USING (
  psychologist_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  AND public.has_role(auth.uid(), 'psychologist')
);

DROP POLICY IF EXISTS "Users can view their own messages" ON chat_messages;
DROP POLICY IF EXISTS "User messages only" ON chat_messages;
CREATE POLICY "User messages only"
ON chat_messages FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Professionals can update alerts" ON alertas_riesgo;
DROP POLICY IF EXISTS "Assigned psych updates alerts" ON alertas_riesgo;
CREATE POLICY "Assigned psych updates alerts"
ON alertas_riesgo FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM patients p
    JOIN profiles prof ON prof.id = p.psychologist_id
    WHERE p.profile_id IN (SELECT id FROM profiles WHERE user_id = alertas_riesgo.user_id)
    AND prof.user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Own profile or assigned" ON profiles;
CREATE POLICY "Own profile or assigned"
ON profiles FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM patients p
    WHERE p.profile_id = profiles.id
      AND p.psychologist_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  )
);

-- ============================================
-- PART 3: PERFORMANCE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_roles_user_active ON user_roles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_members_active ON grupo_miembros(user_id, grupo_id, activo);
CREATE INDEX IF NOT EXISTS idx_messages_created ON grupo_mensajes(grupo_id, fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_type ON profiles(user_id, user_type);
CREATE INDEX IF NOT EXISTS idx_patients_psych ON patients(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON chat_sessions(user_id, session_date DESC);
CREATE INDEX IF NOT EXISTS idx_mood_user ON mood_entries(user_id, created_at DESC);

-- ============================================
-- PART 4: ASSIGN ROLES
-- ============================================

INSERT INTO user_roles (user_id, role)
SELECT user_id, 
  CASE WHEN user_type = 'psychologist' THEN 'psychologist'::app_role ELSE 'patient'::app_role END
FROM profiles
WHERE NOT EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = profiles.user_id)
ON CONFLICT DO NOTHING;

-- ============================================
-- PART 5: AUDIT & RATE LIMITING
-- ============================================

CREATE TABLE IF NOT EXISTS public.data_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL,
  accessed_at timestamp with time zone DEFAULT now()
);

ALTER TABLE data_access_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin audit" ON data_access_log;
CREATE POLICY "Admin audit" ON data_access_log FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  action_type text NOT NULL,
  count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT date_trunc('hour', CURRENT_TIMESTAMP),
  UNIQUE(user_id, action_type, window_start)
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View own limits" ON rate_limits;
CREATE POLICY "View own limits" ON rate_limits FOR SELECT
USING (user_id = auth.uid());