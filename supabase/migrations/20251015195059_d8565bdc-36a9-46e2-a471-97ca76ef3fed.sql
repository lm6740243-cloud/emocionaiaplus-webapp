-- Tablas para sistema de gamificación con wearables

-- Tabla de desafíos diarios
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  challenge_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium',
  points integer NOT NULL DEFAULT 10,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own challenges"
ON public.daily_challenges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges"
ON public.daily_challenges FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can create challenges"
ON public.daily_challenges FOR INSERT
WITH CHECK (true);

-- Tabla de puntos y recompensas
CREATE TABLE IF NOT EXISTS public.user_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  total_points integer NOT NULL DEFAULT 0,
  available_points integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own points"
ON public.user_points FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own points"
ON public.user_points FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points"
ON public.user_points FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Tabla de logros/achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  achievement_key text NOT NULL,
  unlocked_at timestamp with time zone NOT NULL DEFAULT now(),
  progress integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(user_id, achievement_key)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
ON public.user_achievements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own achievements"
ON public.user_achievements FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Tabla de rutas de bienestar
CREATE TABLE IF NOT EXISTS public.wellness_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  route_type text NOT NULL,
  progress integer NOT NULL DEFAULT 0,
  completed_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  active boolean NOT NULL DEFAULT true,
  UNIQUE(user_id, route_type)
);

ALTER TABLE public.wellness_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own routes"
ON public.wellness_routes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own routes"
ON public.wellness_routes FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Tabla de recompensas canjeadas
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reward_type text NOT NULL,
  points_cost integer NOT NULL,
  redeemed_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own redemptions"
ON public.reward_redemptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create redemptions"
ON public.reward_redemptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_user_points_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_points_updated_at
BEFORE UPDATE ON public.user_points
FOR EACH ROW EXECUTE FUNCTION public.update_user_points_timestamp();