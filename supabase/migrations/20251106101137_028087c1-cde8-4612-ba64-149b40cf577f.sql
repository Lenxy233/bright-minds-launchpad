-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  52428800, -- 50MB limit
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
);

-- Create video_lessons table
CREATE TABLE public.video_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration TEXT,
  is_published BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0
);

-- Create quiz_questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_lesson_id UUID NOT NULL REFERENCES public.video_lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of option strings
  correct_answer INTEGER NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.video_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_lessons
CREATE POLICY "Anyone can view published video lessons"
  ON public.video_lessons
  FOR SELECT
  USING (is_published = true OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create video lessons"
  ON public.video_lessons
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their video lessons"
  ON public.video_lessons
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete their video lessons"
  ON public.video_lessons
  FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for quiz_questions
CREATE POLICY "Anyone can view quiz questions for published lessons"
  ON public.quiz_questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.video_lessons
      WHERE video_lessons.id = quiz_questions.video_lesson_id
      AND (video_lessons.is_published = true OR video_lessons.created_by = auth.uid())
    )
  );

CREATE POLICY "Lesson creators can insert quiz questions"
  ON public.quiz_questions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.video_lessons
      WHERE video_lessons.id = quiz_questions.video_lesson_id
      AND video_lessons.created_by = auth.uid()
    )
  );

CREATE POLICY "Lesson creators can update quiz questions"
  ON public.quiz_questions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.video_lessons
      WHERE video_lessons.id = quiz_questions.video_lesson_id
      AND video_lessons.created_by = auth.uid()
    )
  );

CREATE POLICY "Lesson creators can delete quiz questions"
  ON public.quiz_questions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.video_lessons
      WHERE video_lessons.id = quiz_questions.video_lesson_id
      AND video_lessons.created_by = auth.uid()
    )
  );

-- Storage policies for videos bucket
CREATE POLICY "Anyone can view videos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'videos' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authenticated users can update their videos"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'videos' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authenticated users can delete their videos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'videos' 
    AND auth.uid() IS NOT NULL
  );

-- Create updated_at trigger
CREATE TRIGGER update_video_lessons_updated_at
  BEFORE UPDATE ON public.video_lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();