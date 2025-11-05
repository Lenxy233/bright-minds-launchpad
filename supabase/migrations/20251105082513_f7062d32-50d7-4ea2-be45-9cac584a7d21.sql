-- Fix search_path for the branding settings trigger function
-- First drop the trigger, then drop and recreate the function

DROP TRIGGER IF EXISTS update_branding_settings_updated_at ON public.branding_settings;
DROP FUNCTION IF EXISTS public.update_branding_settings_updated_at();

CREATE OR REPLACE FUNCTION public.update_branding_settings_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_branding_settings_updated_at
BEFORE UPDATE ON public.branding_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_branding_settings_updated_at();