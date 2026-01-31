-- Fix RLS policy for events to check user metadata directly
-- Run this in your Supabase SQL Editor

-- First, drop the existing policy
drop policy if exists "Organizers and admins can create events." on events;

-- Create a new policy that checks auth.jwt() metadata
create policy "Organizers and admins can create events." 
  on events for insert with check (
    -- Check the role from JWT metadata (set during signup)
    (auth.jwt() -> 'user_metadata' ->> 'role') in ('organizer', 'admin')
    OR
    -- Also check profiles table as fallback
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.role in ('organizer', 'admin')
    )
  );

-- Also update the events update policy
drop policy if exists "Organizers can update own events." on events;

create policy "Organizers can update own events." 
  on events for update using (
    organizer_id = auth.uid() 
    OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );
