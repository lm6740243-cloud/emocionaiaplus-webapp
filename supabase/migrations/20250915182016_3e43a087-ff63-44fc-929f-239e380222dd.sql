-- Create external_data table for wearable device data
CREATE TABLE public.external_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  data_type TEXT NOT NULL, -- 'steps', 'sleep', 'heart_rate'
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  device_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create calendar_events table for calendar integration
CREATE TABLE public.calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_title TEXT NOT NULL,
  event_start TIMESTAMP WITH TIME ZONE NOT NULL,
  event_end TIMESTAMP WITH TIME ZONE NOT NULL,
  is_stressful BOOLEAN DEFAULT false,
  stress_level INTEGER, -- 1-5 scale
  break_recommended BOOLEAN DEFAULT false,
  break_scheduled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recommendations table
CREATE TABLE public.wellness_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recommendation_type TEXT NOT NULL, -- 'sleep', 'exercise', 'stress', 'break'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  trigger_data JSONB, -- What data triggered this recommendation
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1, -- 1 = high, 2 = medium, 3 = low
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.external_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for external_data
CREATE POLICY "Users can view their own external data"
ON public.external_data FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own external data"
ON public.external_data FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own external data"
ON public.external_data FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for calendar_events
CREATE POLICY "Users can manage their own calendar events"
ON public.calendar_events FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for wellness_recommendations
CREATE POLICY "Users can view their own recommendations"
ON public.wellness_recommendations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create recommendations"
ON public.wellness_recommendations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own recommendations"
ON public.wellness_recommendations FOR UPDATE
USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_external_data_user_id ON public.external_data(user_id);
CREATE INDEX idx_external_data_date ON public.external_data(date);
CREATE INDEX idx_external_data_type ON public.external_data(data_type);
CREATE INDEX idx_calendar_events_user_id ON public.calendar_events(user_id);
CREATE INDEX idx_calendar_events_start ON public.calendar_events(event_start);
CREATE INDEX idx_wellness_recommendations_user_id ON public.wellness_recommendations(user_id);
CREATE INDEX idx_wellness_recommendations_active ON public.wellness_recommendations(is_active);

-- Add triggers for updated_at
CREATE TRIGGER update_external_data_updated_at
BEFORE UPDATE ON public.external_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at
BEFORE UPDATE ON public.calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wellness_recommendations_updated_at
BEFORE UPDATE ON public.wellness_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();