-- Add explicit policies to block anonymous access to profiles table
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Add explicit policies to block anonymous access to user_purchases table
CREATE POLICY "Block anonymous access to purchases"
ON public.user_purchases
FOR SELECT
TO anon
USING (false);