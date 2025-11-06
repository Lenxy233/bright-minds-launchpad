-- Create table for custom curriculum lessons
CREATE TABLE public.curriculum_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_published BOOLEAN DEFAULT false,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_data JSONB NOT NULL,
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.curriculum_lessons ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view published curriculum lessons"
  ON public.curriculum_lessons
  FOR SELECT
  USING (is_published = true OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create curriculum lessons"
  ON public.curriculum_lessons
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their curriculum lessons"
  ON public.curriculum_lessons
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete their curriculum lessons"
  ON public.curriculum_lessons
  FOR DELETE
  USING (auth.uid() = created_by);

-- Trigger for updated_at
CREATE TRIGGER update_curriculum_lessons_updated_at
  BEFORE UPDATE ON public.curriculum_lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();