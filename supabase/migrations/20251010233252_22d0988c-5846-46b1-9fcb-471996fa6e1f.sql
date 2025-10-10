-- Create puzzles table
CREATE TABLE public.puzzles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create puzzle answer zones table
CREATE TABLE public.puzzle_answer_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puzzle_id UUID REFERENCES public.puzzles(id) ON DELETE CASCADE NOT NULL,
  x_position DECIMAL NOT NULL,
  y_position DECIMAL NOT NULL,
  width DECIMAL NOT NULL,
  height DECIMAL NOT NULL,
  correct_answer TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puzzle_answer_zones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for puzzles
CREATE POLICY "Anyone can view puzzles"
  ON public.puzzles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create puzzles"
  ON public.puzzles FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their puzzles"
  ON public.puzzles FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete their puzzles"
  ON public.puzzles FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for answer zones
CREATE POLICY "Anyone can view answer zones"
  ON public.puzzle_answer_zones FOR SELECT
  USING (true);

CREATE POLICY "Puzzle creators can create answer zones"
  ON public.puzzle_answer_zones FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.puzzles
      WHERE id = puzzle_answer_zones.puzzle_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Puzzle creators can update answer zones"
  ON public.puzzle_answer_zones FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.puzzles
      WHERE id = puzzle_answer_zones.puzzle_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Puzzle creators can delete answer zones"
  ON public.puzzle_answer_zones FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.puzzles
      WHERE id = puzzle_answer_zones.puzzle_id
      AND created_by = auth.uid()
    )
  );

-- Create storage bucket for puzzle images
INSERT INTO storage.buckets (id, name, public)
VALUES ('puzzle-images', 'puzzle-images', true);

-- Storage policies
CREATE POLICY "Anyone can view puzzle images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'puzzle-images');

CREATE POLICY "Authenticated users can upload puzzle images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'puzzle-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update their puzzle images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'puzzle-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete their puzzle images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'puzzle-images'
    AND auth.uid() IS NOT NULL
  );

-- Trigger for updated_at
CREATE TRIGGER update_puzzles_updated_at
  BEFORE UPDATE ON public.puzzles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_puzzle_answer_zones_updated_at
  BEFORE UPDATE ON public.puzzle_answer_zones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();