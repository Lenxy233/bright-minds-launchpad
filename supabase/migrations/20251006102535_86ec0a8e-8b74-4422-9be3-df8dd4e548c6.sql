-- Create story_books table
CREATE TABLE public.story_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create story_pages table
CREATE TABLE public.story_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_book_id UUID NOT NULL REFERENCES public.story_books(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  text_content TEXT NOT NULL,
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(story_book_id, page_number)
);

-- Enable Row Level Security
ALTER TABLE public.story_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for story_books
CREATE POLICY "Anyone can view story books"
  ON public.story_books
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create story books"
  ON public.story_books
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their own story books"
  ON public.story_books
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete their own story books"
  ON public.story_books
  FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for story_pages
CREATE POLICY "Anyone can view story pages"
  ON public.story_pages
  FOR SELECT
  USING (true);

CREATE POLICY "Story book creators can insert pages"
  ON public.story_pages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.story_books
      WHERE id = story_book_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Story book creators can update pages"
  ON public.story_pages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.story_books
      WHERE id = story_book_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Story book creators can delete pages"
  ON public.story_pages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.story_books
      WHERE id = story_book_id AND created_by = auth.uid()
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_story_books_updated_at
  BEFORE UPDATE ON public.story_books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_story_pages_updated_at
  BEFORE UPDATE ON public.story_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for story book assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('story-books', 'story-books', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for story-books bucket
CREATE POLICY "Anyone can view story book files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'story-books');

CREATE POLICY "Authenticated users can upload story book files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'story-books' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own story book files"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'story-books' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own story book files"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'story-books' AND auth.role() = 'authenticated');