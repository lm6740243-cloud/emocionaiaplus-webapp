-- Create tasks table for psychologists to assign to patients
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  psychologist_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resources table for psychologists to share with patients
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('article', 'video', 'exercise', 'worksheet', 'audio')),
  url TEXT,
  psychologist_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient_resources table for assigned resources
CREATE TABLE public.patient_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  psychologist_id UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'viewed', 'completed')),
  notes TEXT,
  UNIQUE(patient_id, resource_id)
);

-- Create quick_chats table for asynchronous messaging
CREATE TABLE public.quick_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  psychologist_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('psychologist', 'patient')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_chats ENABLE ROW LEVEL SECURITY;

-- RLS policies for tasks
CREATE POLICY "Psychologists can manage their assigned tasks" ON public.tasks
  FOR ALL USING (auth.uid() = psychologist_id);

CREATE POLICY "Patients can view their assigned tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can update status of their tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

-- RLS policies for resources
CREATE POLICY "Psychologists can manage their resources" ON public.resources
  FOR ALL USING (auth.uid() = psychologist_id);

-- RLS policies for patient_resources
CREATE POLICY "Psychologists can manage patient resource assignments" ON public.patient_resources
  FOR ALL USING (auth.uid() = psychologist_id);

CREATE POLICY "Patients can view their assigned resources" ON public.patient_resources
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can update status of assigned resources" ON public.patient_resources
  FOR UPDATE USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

-- RLS policies for quick_chats
CREATE POLICY "Participants can view their quick chats" ON public.quick_chats
  FOR SELECT USING (auth.uid() = psychologist_id OR auth.uid() = patient_id);

CREATE POLICY "Psychologists can send quick chat messages" ON public.quick_chats
  FOR INSERT WITH CHECK (auth.uid() = psychologist_id AND sender_type = 'psychologist');

CREATE POLICY "Patients can send quick chat messages" ON public.quick_chats
  FOR INSERT WITH CHECK (auth.uid() = patient_id AND sender_type = 'patient');

CREATE POLICY "Users can update read status of their messages" ON public.quick_chats
  FOR UPDATE USING (
    (auth.uid() = psychologist_id AND sender_type = 'patient') OR 
    (auth.uid() = patient_id AND sender_type = 'psychologist')
  );

-- Create triggers for updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_tasks_psychologist_id ON public.tasks(psychologist_id);
CREATE INDEX idx_tasks_patient_id ON public.tasks(patient_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_resources_psychologist_id ON public.resources(psychologist_id);
CREATE INDEX idx_patient_resources_patient_id ON public.patient_resources(patient_id);
CREATE INDEX idx_patient_resources_psychologist_id ON public.patient_resources(psychologist_id);
CREATE INDEX idx_quick_chats_psychologist_id ON public.quick_chats(psychologist_id);
CREATE INDEX idx_quick_chats_patient_id ON public.quick_chats(patient_id);
CREATE INDEX idx_quick_chats_created_at ON public.quick_chats(created_at DESC);