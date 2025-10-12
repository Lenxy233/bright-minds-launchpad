-- Create answer zones table for clock worksheets
CREATE TABLE public.clock_worksheet_answer_zones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_number integer NOT NULL,
  x_position numeric NOT NULL,
  y_position numeric NOT NULL,
  width numeric NOT NULL,
  height numeric NOT NULL,
  order_index integer NOT NULL,
  correct_answer text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(page_number, order_index)
);

-- Enable Row Level Security
ALTER TABLE public.clock_worksheet_answer_zones ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view answer zones"
ON public.clock_worksheet_answer_zones
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create answer zones"
ON public.clock_worksheet_answer_zones
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update answer zones"
ON public.clock_worksheet_answer_zones
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete answer zones"
ON public.clock_worksheet_answer_zones
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_clock_worksheet_answer_zones_updated_at ON public.clock_worksheet_answer_zones;
CREATE TRIGGER update_clock_worksheet_answer_zones_updated_at
BEFORE UPDATE ON public.clock_worksheet_answer_zones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update student answers table to reference answer zones
ALTER TABLE public.clock_worksheet_answers
ADD COLUMN IF NOT EXISTS answer_zone_id uuid REFERENCES public.clock_worksheet_answer_zones(id) ON DELETE CASCADE;