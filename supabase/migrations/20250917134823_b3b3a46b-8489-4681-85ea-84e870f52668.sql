-- Ensure vehicle-images bucket is public
UPDATE storage.buckets
SET public = true
WHERE id = 'vehicle-images';

-- Ensure proper RLS policies for the bucket
CREATE POLICY IF NOT EXISTS "Public read access for vehicle images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'vehicle-images');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload vehicle images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'vehicle-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Authenticated users can update vehicle images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'vehicle-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Authenticated users can delete vehicle images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'vehicle-images' 
  AND auth.role() = 'authenticated'
);