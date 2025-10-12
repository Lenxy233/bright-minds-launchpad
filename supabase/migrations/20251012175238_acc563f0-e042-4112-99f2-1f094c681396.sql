-- Create table for clock worksheet answers
CREATE TABLE public.clock_worksheet_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  clock_index integer NOT NULL,
  student_answer text,
  correct_answer text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, page_number, clock_index)
);

-- Enable Row Level Security
ALTER TABLE public.clock_worksheet_answers ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own answers" 
ON public.clock_worksheet_answers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own answers" 
ON public.clock_worksheet_answers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers" 
ON public.clock_worksheet_answers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own answers" 
ON public.clock_worksheet_answers 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clock_worksheet_answers_updated_at
BEFORE UPDATE ON public.clock_worksheet_answers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();