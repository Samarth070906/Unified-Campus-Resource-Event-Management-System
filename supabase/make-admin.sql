-- Reusable function to promote ANY user to Admin
-- Return: void

create or replace function public.make_user_admin(target_email text)
returns text
language plpgsql
security definer -- runs with admin privileges
as $$
declare
  target_user_id uuid;
begin
  -- 1. Find the user ID based on email
  select id into target_user_id
  from auth.users
  where email = target_email;

  if target_user_id is null then
    return 'User not found: ' || target_email;
  end if;

  -- 2. Update the public profiles table
  update public.profiles
  set role = 'admin'
  where id = target_user_id;

  -- 3. Update auth metadata (optional but recommended for syncing)
  update auth.users
  set raw_user_meta_data = jsonb_set(
    coalesce(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  )
  where id = target_user_id;

  return 'Success: User ' || target_email || ' is now an Admin.';
end;
$$;

-- USAGE EXAMPLES:
-- Run these one at a time whenever you need to add an admin:

-- SELECT make_user_admin('ajharshal45@gmail.com');
-- SELECT make_user_admin('other.person@example.com');
