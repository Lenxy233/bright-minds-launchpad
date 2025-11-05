-- Create table for white-label branding settings
CREATE TABLE public.branding_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Branding customization
  platform_name text NOT NULL DEFAULT 'Bright Minds Academy',
  logo_url text,
  primary_color text DEFAULT '#9b87f5',
  secondary_color text DEFAULT '#7E69AB',
  custom_domain text,
  tagline text,
  
  -- Contact/footer info
  contact_email text,
  social_links jsonb,
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;

-- Users can view their own branding settings
CREATE POLICY "Users can view their own branding settings"
ON public.branding_settings
FOR SELECT
USING (auth.uid() = user_id);

-- Users with valid purchase can insert their branding settings
CREATE POLICY "Purchasers can create branding settings"
ON public.branding_settings
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.user_purchases
    WHERE user_id = auth.uid()
    AND status = 'completed'
    AND bundle_type = 'bma-bundle'
  )
);

-- Users can update their own branding settings
CREATE POLICY "Users can update their own branding settings"
ON public.branding_settings
FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_branding_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_branding_settings_updated_at
BEFORE UPDATE ON public.branding_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_branding_settings_updated_at();