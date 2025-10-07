-- Add category field to story_books table
ALTER TABLE public.story_books 
ADD COLUMN category TEXT DEFAULT 'Uncategorized';

-- Add an index for better performance when filtering by category
CREATE INDEX idx_story_books_category ON public.story_books(category);