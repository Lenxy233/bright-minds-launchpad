-- Add includes_ai_prompts column to user_purchases table
ALTER TABLE public.user_purchases 
ADD COLUMN includes_ai_prompts BOOLEAN DEFAULT false;

-- Create RLS policy for AI prompts storage bucket
CREATE POLICY "Users can view AI prompts if they purchased them" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = '100+ AI IMAGE DESIGN STYLE PROMPTS' 
  AND EXISTS (
    SELECT 1 FROM public.user_purchases 
    WHERE user_id = auth.uid() 
    AND status = 'completed' 
    AND includes_ai_prompts = true
  )
);