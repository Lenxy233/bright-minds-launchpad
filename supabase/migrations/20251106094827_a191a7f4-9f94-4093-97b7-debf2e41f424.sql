-- Create kid profiles table first
CREATE TABLE public.kid_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  pin TEXT NOT NULL,
  avatar_url TEXT,
  age INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on kid_profiles
ALTER TABLE public.kid_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their kids"
  ON public.kid_profiles FOR SELECT
  USING (parent_id = auth.uid() OR parent_id IS NULL);

CREATE POLICY "Parents can create kids"
  ON public.kid_profiles FOR INSERT
  WITH CHECK (parent_id = auth.uid() OR parent_id IS NULL);

CREATE POLICY "Parents can update their kids"
  ON public.kid_profiles FOR UPDATE
  USING (parent_id = auth.uid() OR parent_id IS NULL);

CREATE POLICY "Parents can delete their kids"
  ON public.kid_profiles FOR DELETE
  USING (parent_id = auth.uid());

-- Create points and rewards tables
CREATE TABLE public.kid_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kid_id UUID NOT NULL REFERENCES public.kid_profiles(id) ON DELETE CASCADE UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.kid_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kid_id UUID NOT NULL REFERENCES public.kid_profiles(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(kid_id, badge_name)
);

CREATE TABLE public.kid_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kid_id UUID NOT NULL REFERENCES public.kid_profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 10,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.kid_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kid_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kid_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Kids can view their points"
  ON public.kid_points FOR SELECT
  USING (true);

CREATE POLICY "System can manage points"
  ON public.kid_points FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Kids can view their badges"
  ON public.kid_badges FOR SELECT
  USING (true);

CREATE POLICY "System can award badges"
  ON public.kid_badges FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Kids can view activity log"
  ON public.kid_activity_log FOR SELECT
  USING (true);

CREATE POLICY "System can log activities"
  ON public.kid_activity_log FOR INSERT
  WITH CHECK (true);

-- Function to award points
CREATE OR REPLACE FUNCTION public.award_points(
  p_kid_id UUID,
  p_activity_type TEXT,
  p_activity_id TEXT,
  p_points INTEGER DEFAULT 10
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_points INTEGER;
  v_new_level INTEGER;
  v_badge_awarded TEXT := NULL;
BEGIN
  INSERT INTO public.kid_activity_log (kid_id, activity_type, activity_id, points_earned)
  VALUES (p_kid_id, p_activity_type, p_activity_id, p_points);
  
  INSERT INTO public.kid_points (kid_id, total_points, level)
  VALUES (p_kid_id, p_points, 1)
  ON CONFLICT (kid_id)
  DO UPDATE SET
    total_points = kid_points.total_points + p_points,
    updated_at = NOW()
  RETURNING total_points INTO v_total_points;
  
  v_new_level := FLOOR(v_total_points / 100) + 1;
  
  UPDATE public.kid_points
  SET level = v_new_level
  WHERE kid_id = p_kid_id;
  
  IF v_total_points >= 100 AND NOT EXISTS (
    SELECT 1 FROM public.kid_badges WHERE kid_id = p_kid_id AND badge_name = 'First 100 Points'
  ) THEN
    INSERT INTO public.kid_badges (kid_id, badge_name, badge_description, badge_icon)
    VALUES (p_kid_id, 'First 100 Points', 'Earned 100 points!', '🌟');
    v_badge_awarded := 'First 100 Points';
  END IF;
  
  IF v_total_points >= 500 AND NOT EXISTS (
    SELECT 1 FROM public.kid_badges WHERE kid_id = p_kid_id AND badge_name = 'Super Learner'
  ) THEN
    INSERT INTO public.kid_badges (kid_id, badge_name, badge_description, badge_icon)
    VALUES (p_kid_id, 'Super Learner', 'Reached 500 points!', '⭐');
    v_badge_awarded := 'Super Learner';
  END IF;
  
  RETURN json_build_object(
    'total_points', v_total_points,
    'level', v_new_level,
    'points_earned', p_points,
    'badge_awarded', v_badge_awarded
  );
END;
$$;