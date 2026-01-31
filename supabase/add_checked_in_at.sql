-- Add checked_in_at column to event_registrations table
ALTER TABLE public.event_registrations 
ADD COLUMN checked_in_at timestamp with time zone;
