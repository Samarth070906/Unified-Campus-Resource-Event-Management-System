-- Fix: Create profiles for existing users
-- Run this in Supabase SQL Editor

-- This will create profile entries for any auth users that don't have profiles yet
INSERT INTO public.profiles (id, full_name, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  COALESCE((au.raw_user_meta_data->>'role')::user_role, 'participant')
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;
