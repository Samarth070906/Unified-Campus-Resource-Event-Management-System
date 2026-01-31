-- FIX UPDATE: Removed 'email' column as it's not in profiles
-- ID: c58b2ae3-f5f5-45c7-b4a1-b4ce5dc5a6ba

INSERT INTO public.profiles (id, role, full_name)
SELECT 
  'c58b2ae3-f5f5-45c7-b4a1-b4ce5dc5a6ba',
  'admin',
  COALESCE(raw_user_meta_data->>'full_name', 'Admin User')
FROM auth.users
WHERE id = 'c58b2ae3-f5f5-45c7-b4a1-b4ce5dc5a6ba'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- Verify
SELECT * FROM public.profiles WHERE id = 'c58b2ae3-f5f5-45c7-b4a1-b4ce5dc5a6ba';
