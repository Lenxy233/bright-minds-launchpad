-- Create table to store shareable links for bundles
CREATE TABLE IF NOT EXISTS public.bundle_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_type TEXT NOT NULL,
  link_url TEXT NOT NULL,
  link_title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bundle_links ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing links (public read for purchased users)
CREATE POLICY "Anyone can view bundle links" 
ON public.bundle_links 
FOR SELECT 
USING (true);

-- Insert the BMA Bundle Google Drive link
INSERT INTO public.bundle_links (bundle_type, link_url, link_title, description)
VALUES (
  'BMA Bundle',
  'https://drive.google.com/drive/folders/1Oe59JeYfLt8IU6c4aYFhT9zl-oRqP0jp?usp=sharing',
  'BMA Bundle Files',
  'Complete BMA Bundle collection with all materials and resources'
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bundle_links_updated_at
BEFORE UPDATE ON public.bundle_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();