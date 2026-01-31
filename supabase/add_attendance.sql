-- Add attendance tracking column
ALTER TABLE public.event_registrations
ADD COLUMN checked_in_at timestamp with time zone;
