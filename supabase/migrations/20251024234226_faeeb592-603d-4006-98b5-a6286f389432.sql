-- Make user_id NOT NULL in user_purchases table to prevent RLS bypass
-- This ensures all purchases are properly associated with a user account
ALTER TABLE public.user_purchases 
ALTER COLUMN user_id SET NOT NULL;

-- Add a comment explaining the security requirement
COMMENT ON COLUMN public.user_purchases.user_id IS 'User ID must not be NULL to ensure RLS policies work correctly and all purchases are traceable to a user account';