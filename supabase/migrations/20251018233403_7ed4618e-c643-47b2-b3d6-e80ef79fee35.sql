-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('matching', 'drag-drop', 'quiz', 'tap-find', 'true-false', 'fill-blanks')),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  age_range TEXT,
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT false
);

-- Create activity_items table for storing activity content
CREATE TABLE public.activity_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  item_type TEXT NOT NULL,
  content JSONB NOT NULL,
  order_index INTEGER NOT NULL,
  correct_answer TEXT
);

-- Create activity_responses table for tracking student progress
CREATE TABLE public.activity_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responses JSONB NOT NULL,
  score INTEGER,
  completed BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activities
CREATE POLICY "Anyone can view published activities"
ON public.activities FOR SELECT
USING (is_published = true OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create activities"
ON public.activities FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their activities"
ON public.activities FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete their activities"
ON public.activities FOR DELETE
USING (auth.uid() = created_by);

-- RLS Policies for activity_items
CREATE POLICY "Anyone can view items of published activities"
ON public.activity_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.activities
    WHERE activities.id = activity_items.activity_id
    AND (activities.is_published = true OR activities.created_by = auth.uid())
  )
);

CREATE POLICY "Activity creators can insert items"
ON public.activity_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.activities
    WHERE activities.id = activity_items.activity_id
    AND activities.created_by = auth.uid()
  )
);

CREATE POLICY "Activity creators can update items"
ON public.activity_items FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.activities
    WHERE activities.id = activity_items.activity_id
    AND activities.created_by = auth.uid()
  )
);

CREATE POLICY "Activity creators can delete items"
ON public.activity_items FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.activities
    WHERE activities.id = activity_items.activity_id
    AND activities.created_by = auth.uid()
  )
);

-- RLS Policies for activity_responses
CREATE POLICY "Users can view their own responses"
ON public.activity_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses"
ON public.activity_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses"
ON public.activity_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Create updated_at trigger for activities
CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_activities_created_by ON public.activities(created_by);
CREATE INDEX idx_activity_items_activity_id ON public.activity_items(activity_id);
CREATE INDEX idx_activity_responses_user_id ON public.activity_responses(user_id);
CREATE INDEX idx_activity_responses_activity_id ON public.activity_responses(activity_id);