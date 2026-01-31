-- Add capacity management columns to events table
ALTER TABLE public.events 
ADD COLUMN max_capacity integer,
ADD COLUMN registration_open boolean DEFAULT true;

-- Update existing events to be open by default
UPDATE public.events SET registration_open = true;
