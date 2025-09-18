-- Create storage policies for file uploads to product-files bucket

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-files' AND auth.role() = 'authenticated');

-- Allow authenticated users to view files they uploaded
CREATE POLICY "Users can view uploaded files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-files' AND auth.role() = 'authenticated');

-- Allow authenticated users to update files they uploaded
CREATE POLICY "Users can update their files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-files' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete files
CREATE POLICY "Users can delete files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-files' AND auth.role() = 'authenticated');