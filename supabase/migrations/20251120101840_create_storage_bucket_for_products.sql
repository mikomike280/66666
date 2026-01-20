/*
  # Create Storage Bucket for Product Images

  1. Storage Setup
    - Create `product-images` bucket for storing product photos
    - Set bucket to public for easy access
    - Configure RLS policies for authenticated admin users

  2. Security
    - Allow public read access for product images
    - Only authenticated users can upload/update/delete images
    - Images are publicly accessible via URL

  3. Important Notes
    - Bucket is public to allow customer viewing without authentication
    - Admins must be authenticated to upload/manage images
    - File size limits and format restrictions can be added as needed
*/

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to product images
CREATE POLICY "Public can view product images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- Policy: Authenticated users can upload product images
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Policy: Authenticated users can update product images
CREATE POLICY "Authenticated users can update product images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

-- Policy: Authenticated users can delete product images
CREATE POLICY "Authenticated users can delete product images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');
