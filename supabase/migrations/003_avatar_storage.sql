-- ==============================================================================
-- Migration: Avatar Storage Setup
-- Description: Creates avatars bucket and adds avatar_url to profiles
-- ==============================================================================

-- 1. Add avatar_url column to profiles if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Create storage bucket for avatars (run this in SQL or via Supabase Dashboard)
-- Note: Storage bucket creation via SQL is limited. 
-- You may need to create the bucket manually in Supabase Dashboard > Storage

-- If you have access to storage.buckets, uncomment below:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('avatars', 'avatars', true)
-- ON CONFLICT (id) DO NOTHING;

-- 3. Storage policies (run after bucket is created)
-- Allow authenticated users to upload to their own folder
-- CREATE POLICY "Avatar Upload" ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow public read access
-- CREATE POLICY "Avatar Public Read" ON storage.objects FOR SELECT
-- USING (bucket_id = 'avatars');
