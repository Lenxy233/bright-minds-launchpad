-- Create AI generated content library tables

-- Story books generator config
CREATE TABLE IF NOT EXISTS public.ai_story_generator_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  theme TEXT NOT NULL,
  age_range TEXT NOT NULL,
  lesson_focus TEXT,
  num_pages INTEGER DEFAULT 5,
  illustration_style TEXT DEFAULT 'watercolor',
  generated_story_id UUID
);

ALTER TABLE public.ai_story_generator_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own generator configs"
  ON public.ai_story_generator_config FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own generator configs"
  ON public.ai_story_generator_config FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own generator configs"
  ON public.ai_story_generator_config FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generator configs"
  ON public.ai_story_generator_config FOR DELETE
  USING (auth.uid() = user_id);

-- Interactive games
CREATE TABLE IF NOT EXISTS public.ai_generated_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  game_type TEXT NOT NULL, -- 'letter_match', 'word_build', 'spelling'
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL, -- 'easy', 'medium', 'hard'
  age_range TEXT NOT NULL,
  game_data JSONB NOT NULL, -- stores game configuration
  is_published BOOLEAN DEFAULT false
);

ALTER TABLE public.ai_generated_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published games"
  ON public.ai_generated_games FOR SELECT
  USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "Users can create games"
  ON public.ai_generated_games FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own games"
  ON public.ai_generated_games FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own games"
  ON public.ai_generated_games FOR DELETE
  USING (auth.uid() = user_id);

-- Math quizzes
CREATE TABLE IF NOT EXISTS public.ai_generated_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT NOT NULL, -- 'algebra', 'geometry', 'arithmetic'
  difficulty TEXT NOT NULL,
  age_range TEXT NOT NULL,
  questions JSONB NOT NULL, -- array of questions with answers
  is_published BOOLEAN DEFAULT false
);

ALTER TABLE public.ai_generated_quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published quizzes"
  ON public.ai_generated_quizzes FOR SELECT
  USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "Users can create quizzes"
  ON public.ai_generated_quizzes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quizzes"
  ON public.ai_generated_quizzes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quizzes"
  ON public.ai_generated_quizzes FOR DELETE
  USING (auth.uid() = user_id);

-- AI Tutor chat conversations
CREATE TABLE IF NOT EXISTS public.tutor_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  title TEXT,
  subject TEXT,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.tutor_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON public.tutor_conversations FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create conversations"
  ON public.tutor_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own conversations"
  ON public.tutor_conversations FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- AI Tutor chat messages
CREATE TABLE IF NOT EXISTS public.tutor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.tutor_conversations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  has_audio BOOLEAN DEFAULT false,
  audio_url TEXT
);

ALTER TABLE public.tutor_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from their conversations"
  ON public.tutor_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.tutor_conversations
    WHERE tutor_conversations.id = tutor_messages.conversation_id
    AND (tutor_conversations.user_id = auth.uid() OR tutor_conversations.user_id IS NULL)
  ));

CREATE POLICY "Users can create messages in their conversations"
  ON public.tutor_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.tutor_conversations
    WHERE tutor_conversations.id = tutor_messages.conversation_id
    AND (tutor_conversations.user_id = auth.uid() OR tutor_conversations.user_id IS NULL)
  ));

-- Student progress tracking
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  content_type TEXT NOT NULL, -- 'story', 'game', 'quiz', 'tutor'
  content_id UUID NOT NULL,
  score INTEGER,
  completed BOOLEAN DEFAULT false,
  time_spent INTEGER, -- in seconds
  metadata JSONB
);

ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own student progress"
  ON public.student_progress FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create student progress"
  ON public.student_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own student progress"
  ON public.student_progress FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_story_generator_config_updated_at
  BEFORE UPDATE ON public.ai_story_generator_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_generated_games_updated_at
  BEFORE UPDATE ON public.ai_generated_games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_generated_quizzes_updated_at
  BEFORE UPDATE ON public.ai_generated_quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutor_conversations_updated_at
  BEFORE UPDATE ON public.tutor_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at
  BEFORE UPDATE ON public.student_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();