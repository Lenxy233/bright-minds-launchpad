-- Create table for global correct answers
CREATE TABLE public.clock_worksheet_correct_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_number integer NOT NULL,
  clock_index integer NOT NULL,
  correct_answer text NOT NULL,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(page_number, clock_index)
);

-- Enable Row Level Security
ALTER TABLE public.clock_worksheet_correct_answers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view correct answers"
ON public.clock_worksheet_correct_answers
FOR SELECT
USING (true);

CREATE POLICY "Creators can insert correct answers"
ON public.clock_worksheet_correct_answers
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Creators can update correct answers"
ON public.clock_worksheet_correct_answers
FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Creators can delete correct answers"
ON public.clock_worksheet_correct_answers
FOR DELETE
USING (created_by = auth.uid());

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_clock_worksheet_correct_answers_updated_at ON public.clock_worksheet_correct_answers;
CREATE TRIGGER update_clock_worksheet_correct_answers_updated_at
BEFORE UPDATE ON public.clock_worksheet_correct_answers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();