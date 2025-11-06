-- Allow image thumbnails and video files in the 'videos' bucket
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['video/*','image/png','image/jpeg','image/webp']
WHERE id = 'videos';