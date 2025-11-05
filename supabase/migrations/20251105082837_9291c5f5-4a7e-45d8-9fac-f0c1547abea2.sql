-- Add reseller configuration to branding_settings
ALTER TABLE public.branding_settings
ADD COLUMN enable_reselling boolean DEFAULT false,
ADD COLUMN reseller_stripe_publishable_key text,
ADD COLUMN reseller_stripe_secret_key text,
ADD COLUMN reseller_bundle_price integer DEFAULT 3900,
ADD COLUMN reseller_currency text DEFAULT 'usd',
ADD COLUMN reseller_terms_url text,
ADD COLUMN reseller_support_email text;